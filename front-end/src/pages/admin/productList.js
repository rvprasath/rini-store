import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/admin/productList.css";
import { Link } from "react-router-dom";
import { toast, Bounce } from "react-toastify";

const ProductListPage = () => {
    const [products, setProducts] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get("/products");
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
                    imageArr.sort((a, b) => (a.endsWith(".glb") ? 1 : b.endsWith(".glb") ? -1 : 0));
                    productsResponse[i].imagePaths = imageArr;
                } else {
                    productsResponse[i].imagePaths = [productsResponse[i].image_path];
                }
            }
            setProducts(productsResponse);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const deleteProduct = (id) => {
        axios.delete(`/product/${id}`).then(data => {
            toast.success('Product deleted successfully', {
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
            fetchProducts();
        }).catch(error => {
            console.log(error.response.data)
        })
    }

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
                        <h2>Product List</h2>
                        <div className="productListPage-cards-container">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div className="productListPage-card" key={product.id}>
                                        <div class="delete-product" onClick={() => deleteProduct(product.id)}>x</div>
                                        <img
                                            src={product.imagePaths[0]} // Default image if none exists
                                            alt={product.product_name}
                                            className="productListPage-image"
                                        />
                                        <div className="productListPage-details">
                                            <h3>{product.product_name}</h3>
                                            <div className="productListPage-price-section">
                                                <span className="productListPage-price">₹{product.price}</span>
                                                {product.strikePrice && (
                                                    <span className="productListPage-strike-price">${product.strike_price}</span>
                                                )}
                                            </div>
                                            <div className="productListPage-category">Category: {product.category_name}</div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No products available.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProductListPage;
