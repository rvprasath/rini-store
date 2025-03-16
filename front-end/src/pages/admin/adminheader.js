
import profileIcon from "../../images/profile-icon.png"
import wishListIcon from "../../images/wishlist-icon.png"
import cartIcon from "../../images/cart-icon.png"
import { Link } from "react-router-dom";
import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

function AdminHeader() {
    const { user, logout } = useContext(AuthContext);

    return (
        <>
            <nav>
                <div class="brand-name">
                    <Link to="/admin/">Rini</Link>
                </div>
                <div class="icons">
                    {user ? (<><div class="userLogo">{user.user_name.split("")[0].toUpperCase()}</div>
                        <a href="#" onClick={logout}>Logout</a></>) : <Link to="/login">
                        <img src={profileIcon} alt="Profile Icon" />Logout</Link>}
                </div>
            </nav>
        </>
    )
}

export default AdminHeader;