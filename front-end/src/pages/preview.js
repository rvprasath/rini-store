import "../css/preview.css";
import locationIcon from "../images/location.png";
import freeShipping from "../images/free-shipping.png";
import brand from "../images/brand.png";
import receipient from "../images/recipient.png";
import replacement from "../images/replacement.png";
import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as CANNON from 'cannon-es';
import * as posenet from '@tensorflow-models/posenet';
import axios from "axios";
import { toast, Bounce } from "react-toastify";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { percentage } from "../utility";

function Preview() {
    const location = useLocation();
    const [products, setProducts] = useState(null); // Initially set to null to detect loading
    const [isTryOnActive, setIsTryOnActive] = useState(false);
    const videoElement = useRef(null);
    const canvasContainer = useRef(null);
    const tryOnBtn = useRef(null);

    const [poseNet, setPoseNet] = useState(null);
    const [model, setModel] = useState(null);
    const [isSingleImage, setIsSingleImage] = useState(false);
    const [tryOnOff, setTryOnOff] = useState("off");
    const [id, setId] = useState();

    let world, physicsMaterial, body;
    let leftShoulder, rightShoulder, leftHand, rightHand;

    const shoulderLeftBoneName = 'shoulder_left';
    const shoulderRightBoneName = 'shoulder_right';
    const armLeftTopBoneName = 'arm_left_top';
    const armLeftBotBoneName = 'arm_left_bot';
    const armRightTopBoneName = 'arm_right_top';
    const armRightBotBoneName = 'arm_right_bot';

    const [src, setSrc] = useState();
    const navigate = useNavigate();

    const changeImage = (e, image) => {
        setSrc(image)
        document.querySelectorAll(".thumbnail").forEach(img => img.classList.remove("active"));
        // thumbnail.classList.add("active");
    }

    useEffect(() => {
        // Check if there is only one image
        if (products != null && products.image_path.split(",").length === 1) {
            setIsSingleImage(true);
        } else {
            setIsSingleImage(false);
        }
    }, [products]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        let productId = urlParams.get('id');
        setId(productId);
        fetchProduct(productId);
    }, []);

    // Fetch product data after the component is mounted
    const fetchProduct = async (productId) => {
        try {
            const response = await axios.get(`/product/${productId}`);
            let productsResponse = response.data;
            // for (let i = 0; i < productsResponse.length; i++) {
            let imageArr = [];
            if (productsResponse.image_path.includes(",")) {
                let image_path_arr = productsResponse.image_path.split("/");
                let images = image_path_arr[2].split(",");
                let dir = "/" + image_path_arr[1] + "/";
                for (let j = 0; j < images.length; j++) {
                    if (images[j].includes(".glb")) {
                        productsResponse.glbPath = dir + images[j];
                        setTryOnOff("on")
                    } else {
                        if (j == 0) {
                            setSrc(dir + images[j])
                        }
                        imageArr.push(dir + images[j]);
                        productsResponse.glbPath = [];
                    }
                }
                productsResponse.imagePaths = imageArr;
            } else {
                setSrc(productsResponse.image_path)
                productsResponse.imagePaths = [productsResponse.image_path];
                productsResponse.glbPath = [productsResponse.image_path];
                setTryOnOff("off")
            }
            // }
            setProducts(productsResponse);
        } catch (error) {
            console.error("Error fetching product:", error);
        }
    };

    // Initialize the scene only after product data is fetched
    useEffect(() => {
        if (products && products.glbPath.includes(".glb")) {
            initScene();
        }
    }, [products]); // Trigger when 'products' is set

    const stopCamera = () => {
        const stream = videoElement.current.srcObject;

        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoElement.current.srcObject = null;
        }
    };

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
        loader.load(products.glbPath, (gltf) => { // Use products.image_path here
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

    const handleTryOnOffClick = () => {
        if (tryOnOff == "on") {
            setTryOnOff("off")
            videoElement.current.style.opacity = 1;
            startCamera();
            setIsTryOnActive(true);
        } else {
            setTryOnOff("on")
            stopCamera();
        }
    };

    const addToCart = async (productId) => {
        if (localStorage.getItem('user') != null) {
            const cartData = {
                "userId": JSON.parse(localStorage.getItem('user')).id,
                "productId": productId
            }
            const response = await axios.post(`/addToCart`, cartData).then(response => {
                toast.success('Product added to the cart', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                setTimeout(() => {
                    window.location.reload()
                }, 500);
            }).catch(error => {
                toast.error(error.response.data.error, {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
            })
        } else {
            toast.info('Login to add products to the cart', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    }

    const user = JSON.parse(localStorage.getItem('user'));

    const handleBuyNowClick = (e) => {
        if (!user) {
            toast.info('Login to buy products', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            e.preventDefault();
        }
    };

    const settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        // autoplaySpeed: 3000,
        fade: true,
        // pauseOnHover: true,
        arrows: true
    };

    const confirmOrder = () => {
        localStorage.setItem("orderData", id);
        navigate("/confirmOrder")
    }

    return (
        <>
            <main>
                <div className="menu-header"><h2>Product Details</h2></div>
                <div className="container">
                    <div className="product">
                        {products != null ?
                            products.category_id != 3 ?
                                (<div className={`product-slider-container ${isSingleImage ? 'singleImage' : ''}`}>
                                    < Slider {...settings}>
                                        {products.glbPath.includes(".glb") ?
                                            <div className="slider-item">
                                                <div className="product-image">
                                                    <div class="model-tag">3D Model</div>
                                                    <div className="video-container">
                                                        <video ref={videoElement} id="video" width="640" height="480"></video>
                                                    </div>
                                                    <div className="canvas-container" ref={canvasContainer}></div>
                                                </div>
                                            </div>
                                            : null
                                        }
                                        {products.imagePaths && products.imagePaths.map((image, index) => (
                                            <div className="slider-item">
                                                <div className="product-image">
                                                    <div className="video-container">
                                                        <img height="480" width="640" src={image} alt={`Product Image ${index + 1}`} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>)
                                :
                                <div className="product-slider-container">
                                    <div class="image-section">
                                        <div class="thumbnail-container">
                                            {products.imagePaths && products.imagePaths.map((image, index) => (
                                                <img src={image} class={`thumbnail ${index == 0 ? 'active' : ''}`} onClick={(e) => changeImage(e, image)} />
                                            ))}
                                        </div>
                                        <div class="product-image-container">
                                            <img src={src} height="480" width="640" class="main-image" id="mainImage" />
                                        </div>
                                    </div>
                                </div>
                            : <></>
                        }

                        <div className="product-details">
                            <h1 className="product-title">RINI</h1>
                            <h3 className="product-name" id="desc">{products?.product_name}</h3>
                            <h3 className="product-description" id="desc">{products?.description}</h3>

                            <div className="product-price">
                                <span id="price">₹{products?.price}</span>
                                <span className="strike-price" id="strikePrice">₹{products?.strike_price}</span>
                                <span className="discount">&nbsp;({percentage(products?.price, products?.strike_price)} off)</span>
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

                                <div>
                                    {products != null && products.glbPath.includes(".glb") ?
                                        tryOnOff == "on" ?
                                            <button ref={tryOnBtn} onClick={handleTryOnOffClick} id="try-on-btn">Try On</button>
                                            :
                                            <button ref={tryOnBtn} onClick={handleTryOnOffClick} id="try-on-btn">Try Off</button>
                                        : null
                                    }
                                </div>
                            </div>

                            <div className="delivery-info">
                                <img src={locationIcon} alt="location" />
                                <p className="delivery-location">Delivering to your location - UPDATE LOCATION</p>
                                <p className="free-delivery"><b>Free delivery</b> within one week</p>
                            </div>

                            <div className="product-buttons">
                                <button className="btn btn-success" onClick={() => addToCart(products.id)}>Add To Cart</button>
                                {user ? (
                                    <button className="btn btn-warning buy-buton" onClick={confirmOrder}>
                                        Buy Now
                                    </button>
                                ) : (
                                    <button className="btn btn-warning" onClick={handleBuyNowClick}>
                                        Login to Buy
                                    </button>
                                )}
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
            </main >
        </>
    );
}

export default Preview;
