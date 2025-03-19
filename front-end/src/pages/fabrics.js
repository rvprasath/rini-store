
import "../css/fabrics.css"
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios"

function Fabrics() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/category/product/3");
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

        fetchProducts();
    }, []);
    return (
        <>
            <main>
                <div class="menu-header"><h2>Fabric customization</h2></div>
                <div class="product-list">

                    {products.length > 0 ? (
                        products.map((product) => (
                            <Link
                                className="product-card"
                                to={{
                                    pathname: "/preview",
                                    search: `?id=${product.id}`,
                                }}
                            >
                                <img src={product.imagePaths[0]} alt="blazer1" />
                                {/* <p class="brand-name">RINI</p> */}
                                {/* <h2 class="product-name">{product?.product_name}</h2>
                                <div class="product-description">{product?.description}</div>
                                <h3 class="product-price">₹{product.price}&nbsp;<strike>₹{product.strike_price}</strike>&nbsp;<p class="discount">(80% off)</p></h3> */}
                            </Link>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}
                </div>
            </main>
        </>
    )
}

export default Fabrics;