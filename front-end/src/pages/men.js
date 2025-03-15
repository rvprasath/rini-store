import "../css/men.css"
import blazer from "../images/mblazer1_1.png"
import blazerModel from "../models/Jacket.glb"
import shirt1 from "../images/mshirt1_1.png"
import cargo from "../images/cargo1_1.png"
import shirt3 from "../images/shirt3_1.png"
import { Link } from "react-router-dom";

function Men() {
    return (
        <>
            <main>
                <div class="mennu-header"><h2>Men's Wear</h2></div>
                <div class="product-list">
                    <Link
                        className="product-card"
                        to={{
                            pathname: "/preview",
                            search: `?desc=Men's Solid Regular Fit Formal White Blazer&strikeprice=4999&price=3999&image=${blazerModel}`,
                        }}
                    >
                        <img src={blazer} alt="blazer1" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Men's Solid Regular Fit Formal White Blazer</p>
                        <h3 class="product-price">₹3999 <strike>₹4999</strike><p class="discount">(80% off)</p></h3>
                    </Link>

                    <Link
                        className="product-card"
                        to={{
                            pathname: "/preview",
                            search: `?desc=Men's Full Sleeve Formal Navy Blue Shirt&strikeprice=1899&price=1519&image=${shirt1}`,
                        }}
                    >
                        <img src={shirt1} alt="shirt1" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Men's Full Sleeve Formal Navy Blue Shirt</p>
                        <h3 class="product-price">₹1519 <strike>₹1899</strike><p class="discount">(80% off)</p></h3>
                    </Link>

                    <a class="product-card" href="preview.html?desc=Men's Solid Slim Fit Cotton Pant Grey&strikeprice=0&price=2999&image=cargo1_1.png">
                        <img src={cargo} alt="cargo" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Men's Solid Slim Fit Cotton Pant Grey</p>
                        <h3 class="product-price">₹2999</h3>
                    </a>

                    <a class="product-card" href="preview.html?desc=Men's Full Sleeve Corduroy Striped Casual Jacket&strikeprice=0&price=3899&image=shirt3_1.png">
                        <img src={shirt3} alt="jacket1" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Men's Full Sleeve Corduroy Striped Casual Jacket</p>
                        <h3 class="product-price">₹3899</h3>
                    </a>
                </div>
            </main>
        </>
    )
}

export default Men;