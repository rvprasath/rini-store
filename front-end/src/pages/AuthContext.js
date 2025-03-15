import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Create a Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    // Check for user info in cookies on initial load
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
        setUser(userData); // Update global state
        navigate("/"); // Navigate to home page
    };

    const logout = () => {
        localStorage.removeItem('user'); // Remove user from localStorage
        setUser(null); // Reset global state
        navigate("/login"); // Navigate to login page
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
