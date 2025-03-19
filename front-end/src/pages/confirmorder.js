import React, { useState, useEffect } from "react";
import "../css/confirmOrder.css";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";

const ConfirmOrder = () => {
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [id, setId] = useState();
    const [products, setProducts] = useState();
    const [totalPrice, setTotalPrice] = useState();

    const handleConfirmOrder = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setOrderPlaced(true); // Set the order as placed after confirmation
        }, 2000); // Simulating an API call delay
    };

    const handleCancelOrder = () => {
        setOrderPlaced(false);
        navigate("/preview");
    };

    const cancelOrder = () => {
        setOrderPlaced(false)
        if (id.split(",").length > 1) {
            navigate("/cart");
        } else {
            navigate("/preview?id=" + id);
        }
    }

    useEffect(() => {
        let isMounted = true; // Track whether the component is mounted
        const fetchData = async () => {
            let ids = localStorage.getItem("orderData");
            let totalPriceSum = 0;
            const response = await axios.get(`/productIds?ids=${ids}`);
            let productsResponse = response.data;
            let imageArr = [];
    
            for (let i = 0; i < productsResponse.length; i++) {
                totalPriceSum += productsResponse[i].price;
                if (productsResponse[i].image_path.includes(",")) {
                    let image_path_arr = productsResponse[i].image_path.split("/");
                    let images = image_path_arr[2].split(",");
                    let dir = "/" + image_path_arr[1] + "/";
                    for (let j = 0; j < images.length; j++) {
                        if (images[j].includes(".glb")) {
                            productsResponse[i].glbPath = dir + images[j];
                        } else {
                            imageArr.push(dir + images[j]);
                            productsResponse[i].glbPath = [];
                        }
                    }
                    productsResponse[i].imagePaths = imageArr;
                } else {
                    productsResponse[i].imagePaths = [productsResponse[i].image_path];
                    productsResponse[i].glbPath = [productsResponse[i].image_path];
                }
            }
    
            if (isMounted) { // Only update state if component is still mounted
                setTotalPrice(totalPriceSum);
                setProducts(productsResponse);
                setId(ids);
            }
        };
    
        fetchData();
    
        return () => {
            isMounted = false; // Cleanup flag when the component is unmounted
        };
    }, []);
    

    return (
        <main>
            <div className="container">
                <div className="confirm-order-container">
                    <h1>Confirm Your Order</h1>
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <ul>
                            {products?.length > 0 ? (
                                products.map((product) => (
                                    <li>
                                        <div>
                                            <img src={product?.imagePaths[0]} height="50px" width="50px" />
                                        </div>
                                        <div>
                                            <strong>{product?.product_name}</strong> - {product?.length} x ₹{product?.price}
                                        </div>
                                        <hr />
                                    </li>))) : <></>
                            }
                        </ul>
                        <div className="total-price">
                            <strong>Total Price: ₹{totalPrice}</strong>
                        </div>
                    </div>

                    {!orderPlaced ? (
                        <div className="order-actions">
                            <button
                                className="confirm-button"
                                onClick={handleConfirmOrder}
                                disabled={isLoading}
                            >
                                {isLoading ? "Processing..." : "Confirm Order"}
                            </button>
                            <button onClick={cancelOrder} className="cancel-button">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="order-success">
                            <div className="ticket-icon">
                                <div className="checkmark"></div>
                            </div> {/* Ticket Icon with Checkmark */}
                            <h2>Order Placed Successfully!</h2>
                            <p>Thank you for your purchase. Your order is being processed.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ConfirmOrder;
