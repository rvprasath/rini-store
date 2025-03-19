// AdminPage.js
import React, { useState } from "react";
import axios from "axios";
import "../../css/admin/admin.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const Admin = () => {
    const [files, setFiles] = useState([]);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [price, setPrice] = useState("");
    const [strikePrice, setStrikePrice] = useState("");
    const [category, setCategory] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prepare FormData to send files and other data
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        formData.append("productName", productName);
        formData.append("description", productDescription);
        formData.append("price", price);
        formData.append("strikePrice", strikePrice);
        formData.append("category", category);

        try {
            const response = await axios.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success('Upload Successful' + response.data.message, {
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

            navigate("/admin/products")
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("Error uploading files.");
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar open state
    };

    return (
        <main>
            <div className="admin-container">
                <div className="inline-page">
                    <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                        <h3>Admin Panel</h3>
                        <ul>
                            <li><Link to="/admin/products">Products</Link></li>
                            <li><Link to="/admin">Add Product</Link></li>
                            {/* <li>Orders</li>
                            <li>Settings</li> */}
                        </ul>
                    </div>

                    <div className="main-content">
                        <h2>Upload Product</h2>
                        <form onSubmit={handleSubmit} encType="multipart/form-data" className="product-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Product Description</label>
                                    <textarea
                                        type="text"
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        required>
                                    </textarea>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                                        <option value="">Select Category</option>
                                        <option value="1">Men</option>
                                        <option value="2">Women</option>
                                        <option value="3">Fabrics</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Strike Through Price</label>
                                    <input
                                        type="number"
                                        value={strikePrice}
                                        onChange={(e) => setStrikePrice(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Upload Files (Images, GLB, etc.)</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleFileChange}
                                        accept="image/*, .glb"
                                    />
                                </div>
                            </div>

                            <div class="UploadProductBtn-container">
                                <button type="submit">Upload Product</button>
                            </div>
                        </form>

                        {/* Button to toggle sidebar visibility on smaller screens */}
                        {/* <button onClick={toggleSidebar} className="toggle-sidebar">
                            {isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
                        </button> */}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Admin;
