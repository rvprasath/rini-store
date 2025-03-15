import "../css/preview.css";
import locationIcon from "../images/location.png";
import freeShipping from "../images/free-shipping.png";
import brand from "../images/brand.png";
import receipient from "../images/recipient.png";
import replacement from "../images/replacement.png";
import blazer from "../models/shirt_rig1.glb";
import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as CANNON from 'cannon-es';
import * as posenet from '@tensorflow-models/posenet';

function Preview() {
    const location = useLocation();
    const [description, setDescription] = useState('');
    const [strikePrice, setStrikePrice] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        // Extract URL parameters
        const urlParams = new URLSearchParams(location.search);
        setDescription(urlParams.get('desc') || ''); // Default empty string if no value
        setStrikePrice(urlParams.get('strikeprice') || '');
        setPrice(urlParams.get('price') || '');
    }, [location]);

    const videoElement = useRef(null);
    const canvasContainer = useRef(null);
    const tryOnBtn = useRef(null);

    const [isTryOnActive, setIsTryOnActive] = useState(false);
    const [poseNet, setPoseNet] = useState(null);
    const [model, setModel] = useState(null);

    let world, physicsMaterial, body;
    let leftShoulder, rightShoulder, leftHand, rightHand;

    const shoulderLeftBoneName = 'shoulder_left';
    const shoulderRightBoneName = 'shoulder_right';
    const armLeftTopBoneName = 'arm_left_top';
    const armLeftBotBoneName = 'arm_left_bot';
    const armRightTopBoneName = 'arm_right_top';
    const armRightBotBoneName = 'arm_right_bot';

    useEffect(() => {
        initScene();
        return () => {
            if (videoElement.current) {
                videoElement.current.srcObject?.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        videoElement.current.srcObject = stream;
        videoElement.current.play();

        await new Promise(resolve => {
            videoElement.current.onloadedmetadata = resolve;
        });

        if (videoElement.current.videoWidth === 0 || videoElement.current.videoHeight === 0) {
            console.error('Invalid video dimensions');
            return;
        }

        const net = await posenet.load();
        setPoseNet(net);
        detectPose(net);
    };

    const detectPose = async (net) => {
        const pose = await net.estimateSinglePose(videoElement.current, { flipHorizontal: false });

        if (pose.keypoints) {
            leftShoulder = pose.keypoints.find(point => point.part === 'leftShoulder');
            rightShoulder = pose.keypoints.find(point => point.part === 'rightShoulder');
            leftHand = pose.keypoints.find(point => point.part === 'leftWrist');
            rightHand = pose.keypoints.find(point => point.part === 'rightWrist');

            if (leftShoulder && rightShoulder && isTryOnActive) {
                const modelX = (leftShoulder.position.x + rightShoulder.position.x) / 2;
                const modelY = (leftShoulder.position.y + rightShoulder.position.y) / 2;
                body.position.x = (modelX / videoElement.current.videoWidth) * 2 - 1;
                body.position.y = -(modelY / videoElement.current.videoHeight) * 2 + 1;
                model.position.set(body.position.x, body.position.y - 0.52, body.position.z);

                const shoulderDistance = Math.sqrt(
                    Math.pow(leftShoulder.position.x - rightShoulder.position.x, 2) +
                    Math.pow(leftShoulder.position.y - rightShoulder.position.y, 2)
                );
                const scaleFactor = shoulderDistance / 100;
                model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            }

            if (leftHand && model) {
                updateArmRotation(model, leftHand.position, armLeftTopBoneName, armLeftBotBoneName, shoulderLeftBoneName);
            }
            if (rightHand && model) {
                updateArmRotation(model, rightHand.position, armRightTopBoneName, armRightBotBoneName, shoulderRightBoneName);
            }

            updateBodyRotation(leftShoulder, rightShoulder);
        }

        requestAnimationFrame(() => detectPose(net));
    };

    const updateArmRotation = (model, handPosition, upperBoneName, lowerBoneName, shoulderBoneName) => {
        const upperBone = model.getObjectByName(upperBoneName);
        const lowerBone = model.getObjectByName(lowerBoneName);
        const shoulderBone = model.getObjectByName(shoulderBoneName);

        if (upperBone && lowerBone && shoulderBone) {
            const x = (handPosition.x / videoElement.current.videoWidth) * 2 - 1;
            const y = -(handPosition.y / videoElement.current.videoHeight) * 2 + 1;

            shoulderBone.rotation.x = Math.sin(y) * Math.PI * 0.3;

            const upperArmVector = new THREE.Vector3(handPosition.x - upperBone.position.x, handPosition.y - upperBone.position.y, 0);
            const forearmVector = new THREE.Vector3(handPosition.x - lowerBone.position.x, handPosition.y - lowerBone.position.y, 0);

            const angle = upperArmVector.angleTo(forearmVector);
            const bendAmount = Math.min(Math.max(angle * 2, 0), Math.PI / 2);
            upperBone.rotation.z = bendAmount;
            lowerBone.rotation.z = -bendAmount;
        }
    };

    const updateBodyRotation = (leftShoulder, rightShoulder) => {
        const angle = Math.atan2(
            rightShoulder.position.y - leftShoulder.position.y,
            rightShoulder.position.x - leftShoulder.position.x
        );

        model.rotation.y = angle + Math.PI;
    };

    let renderer;
    const initScene = () => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 640 / 480, 0.1, 1000);
        if (!renderer) {
            renderer = new THREE.WebGLRenderer({ alpha: true });
            renderer.setSize(640, 480);
            canvasContainer.current.appendChild(renderer.domElement);
        }

        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5).normalize();
        scene.add(directionalLight);

        world = new CANNON.World();
        world.gravity.set(0, -9.82, 0);
        world.broadphase = new CANNON.NaiveBroadphase();
        world.solver.iterations = 10;

        physicsMaterial = new CANNON.Material();
        body = new CANNON.Body({ mass: 1 });
        body.position.set(0, 1, 0);
        world.addBody(body);

        const loader = new GLTFLoader();
        loader.load(blazer, (gltf) => {
            const model = gltf.scene;
            model.scale.set(1, 1, 1); // Adjusted scaling
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = new THREE.MeshStandardMaterial({
                        map: child.material.map,
                        roughness: 0.5,
                        metalness: 0.1,
                    });
                }
            });
            scene.add(model);
            setModel(model);
        });

        camera.position.z = 3;

        const animate = () => {
            requestAnimationFrame(animate);
            world.step(1 / 60);
            renderer.render(scene, camera);
        };

        animate();
    };

    const handleTryOnClick = () => {
        videoElement.current.style.opacity = 1;
        startCamera();
        setIsTryOnActive(true);
    };

    return (
        <>
            <main>
                <div class="mennu-header"><h2>Product Details</h2></div>
                <div className="container">
                    <div className="product">
                        <div className="product-image">
                            <div class="video-container">
                                <video ref={videoElement} id="video" width="640" height="480"></video>
                            </div>
                            <div className="canvas-container" ref={canvasContainer}></div>
                        </div>

                        <div className="product-details">
                            <h1 className="product-title">RINI</h1>
                            <h3 className="product-description" id="desc">{description}</h3>

                            <div className="product-price">
                                <span id="price">{`₹${price}`}</span>
                                <span className="strike-price" id="strikePrice">{`₹${strikePrice}`}</span>
                                <span className="discount">&nbsp;(80% off)</span>
                            </div>

                            <div className="parameter-container">
                                <div className="size-selector">
                                    <label htmlFor="size">SIZE:</label>
                                    <select name="size" id="size">
                                        <option value="32">32</option>
                                        <option value="34">34</option>
                                        <option value="38">38</option>
                                        <option value="40">40</option>
                                    </select>
                                </div>

                                <button ref={tryOnBtn} onClick={handleTryOnClick} id="try-on-btn">Try On</button>
                            </div>

                            <div className="delivery-info">
                                <img src={locationIcon} alt="location" />
                                <p className="delivery-location">Delivering to your location - UPDATE LOCATION</p>
                                <p className="free-delivery"><b>Free delivery</b> within one week</p>
                            </div>

                            <div className="product-buttons">
                                <button className="btn btn-success">Add To Cart</button>
                                <button className="btn btn-warning">Buy Now</button>
                            </div>

                            <div className="product-shipping">
                                <div className="shipping-item">
                                    <img src={freeShipping} alt="Free Shipping" />
                                    <p>Free<br />Delivery</p>
                                </div>
                                <div className="shipping-item">
                                    <img src={brand} alt="Brand" />
                                    <p>Top<br />Brand</p>
                                </div>
                                <div className="shipping-item">
                                    <img src={receipient} alt="Postal Delivery" />
                                    <p>Postal<br />Delivery</p>
                                </div>
                                <div className="shipping-item">
                                    <img src={replacement} alt="Replacement" />
                                    <p>Pre<br />Replacement</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Preview;
