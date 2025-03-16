
import profileIcon from "../images/profile-icon.png"
import wishListIcon from "../images/wishlist-icon.png"
import cartIcon from "../images/cart-icon.png"
import { Link } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';

function Header() {
    const { user, logout } = useContext(AuthContext);
    const [cart, setCart] = useState(0);
    const location = useLocation(); 

    useEffect(() => {
        if (localStorage.getItem('user') != null) {
            axios.get("/getCartCount?userId=" + JSON.parse(localStorage.getItem('user')).id).then(response => {
                setCart(response.data.count);
            }).catch(error => {
                console.log(error.response.data.error);
            })
        }
    }, [location])

    return (
        <>
            <nav>
                <div class="brand-name">
                    <Link to="/">Rini</Link>
                </div>
                <div>
                    <Link to="/men">MEN</Link>
                    <Link to="/women">WOMEN</Link>
                    <Link to="/fabrics">FABRIC</Link>
                </div>
                <div class="icons">
                    <div class="search-box">
                        <input type="text" placeholder="Search..." />
                    </div>
                    {user ? (<><div class="userLogo">{user.user_name.split("")[0].toUpperCase()}</div><a href="#" onClick={logout}>Logout</a></>) : <Link to="/login"><img src={profileIcon} alt="Profile Icon" /></Link>}
                    <img src={wishListIcon} alt="Wishlist Icon" />
                    <Link to="/cart">
                        <span class="cartcount-container">
                            <img src={cartIcon} alt="Cart Icon" />
                            <span class="cartcount">{cart}</span>
                        </span>
                    </Link>
                </div>
            </nav>
        </>
    )
}

export default Header;