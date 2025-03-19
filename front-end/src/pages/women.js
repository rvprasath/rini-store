import "../css/men.css"
import blazerModel from "../models/Jacket.glb"
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios"
import { percentage } from "../utility";

function Women() {

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("/category/product/2");
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
                <div class="menu-header"><h2>Women's Wear</h2></div>
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
                                <h2 class="product-name">{product?.product_name}</h2>
                                <div class="product-description">{product?.description}</div>
                                <h3 class="product-price">₹{product.price}&nbsp;<strike>₹{product.strike_price}</strike>&nbsp;<p class="discount">({percentage(product.price, product.strike_price)} off)</p></h3>
                            </Link>
                        ))
                    ) : (
                        <p>No products available.</p>
                    )}

                    {/* <Link
                        className="product-card"
                        to={{
                            pathname: "/preview",
                            search: `?desc=Men's Full Sleeve Formal Navy Blue Shirt&strikeprice=1899&price=1519&image=${dress1}`,
                        }}
                    >
                        <img src={dress1} alt="shirt1" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Animal Skin Printed Women's Maxi</p>
                        <h3 class="product-price">₹1519 <strike>₹1899</strike><p class="discount">(80% off)</p></h3>
                    </Link>

                    <a class="product-card" href="preview.html?desc=Men's Solid Slim Fit Cotton Pant Grey&strikeprice=0&price=2999&image=cargo1_1.png">
                        <img src={dress2} alt="cargo" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Women's Sleeveless Shimmery Party Wear</p>
                        <h3 class="product-price">₹2999</h3>
                    </a>

                    <a class="product-card" href="preview.html?desc=Men's Full Sleeve Corduroy Striped Casual Jacket&strikeprice=0&price=3899&image=shirt3_1.png">
                        <img src={dress3} alt="jacket1" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Women's Black Leather Body Suit</p>
                        <h3 class="product-price">₹3899</h3>
                    </a> */}
                </div>
            </main>
        </>
    )
}

export default Women;