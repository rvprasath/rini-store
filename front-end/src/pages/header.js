
import profileIcon from "../images/profile-icon.png"
import wishListIcon from "../images/wishlist-icon.png"
import cartIcon from "../images/cart-icon.png"
import { Link } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

function Header() {
    const { user, logout } = useContext(AuthContext);

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
                    <img src={cartIcon} alt="Cart Icon" />
                </div>
            </nav>
        </>
    )
}

export default Header;