import React, { useState } from "react";
import "../css/confirmOrder.css";
import { useNavigate } from "react-router-dom";

const ConfirmOrder = () => {
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const order = {
        items: [
            { name: "Item 1", quantity: 2, price: 20 },
            { name: "Item 2", quantity: 1, price: 50 },
            { name: "Item 3", quantity: 3, price: 10 },
        ],
        totalPrice: 120, // Simple calculation of total price
    };

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

    return (
        <main>
            <div className="container">
                <div className="confirm-order-container">
                    <h1>Confirm Your Order</h1>
                    <div className="order-summary">
                        <h2>Order Summary</h2>
                        <ul>
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    <strong>{item.name}</strong> - {item.quantity} x ${item.price}
                                </li>
                            ))}
                        </ul>
                        <div className="total-price">
                            <strong>Total Price: ${order.totalPrice}</strong>
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
                            <button className="cancel-button" onClick={handleCancelOrder}>
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
