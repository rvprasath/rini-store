import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../css/cart.css";
import { toast, Bounce } from 'react-toastify';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);


    // Fetch cart items from backend
    const fetchCartItems = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('user')).id; // Get user ID from localStorage
            const response = await axios.get(`/getCartItems?userId=${userId}`);
            let productsResponse = response.data;
            for (let i = 0; i < productsResponse.length; i++) {
                let imageArr = [];
                if (productsResponse[i].image_path.includes(",")) {
                    let image_path_arr = productsResponse[i].image_path.split("/");
                    let images = image_path_arr[2].split(",");
                    let dir = "/" + image_path_arr[1] + "/";
                    for (let j = 0; j < images.length; j++) {
                        imageArr.push(dir + images[j]);
                    }
                    productsResponse[i].imagePaths = imageArr;
                } else {
                    productsResponse[i].imagePaths = [productsResponse[i].image_path];
                }
            }
            setCartItems(productsResponse);
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const removeCart = async (cart_id) => {
        await axios.delete(`/removeCart?cartId=${cart_id}`).then(response => {
            toast.success('Removed from cart', {
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
            fetchCartItems();
            setTimeout(() => {
                window.location.reload()
            }, 500);
        })
    }

    return (
        <main>
            <div className="cart-container">
                <h2>Your Cart</h2>
                <div className="cart-items-container">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.product_id}>
                                <div className="cart-item-left">
                                    <div className="cart-item-image">
                                        <img src={item.imagePaths[0]} alt={item.product_name} />
                                    </div>
                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.product_name}</h3>
                                        <p className="cart-item-price">₹{item.price}</p>
                                        <p className="cart-item-strike-price">₹{item.strike_price}</p>
                                    </div>
                                </div>
                                <div className="cart-item-actions">
                                    <button className="remove-btn" onClick={() => removeCart(item.cart_id)}>Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default Cart;
