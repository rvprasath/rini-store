import "../css/men.css"
import bodycon from "../images/wfbodycon_1.png"
// import blazerModel from "../models/Jacket.glb"
import dress1 from "../images/dress2_1.png"
import dress2 from "../images/wdress4_1.png"
import dress3 from "../images/wbc1_1.png"
import { Link } from "react-router-dom";

function Women() {
    return (
        <>
            <main>
                <div class="mennu-header"><h2>Women's Wear</h2></div>
                <div class="product-list">
                    <Link
                        className="product-card"
                        to={{
                            pathname: "/preview",
                            search: `?desc=Men's Solid Regular Fit Formal White Blazer&strikeprice=4999&price=3999&image=${bodycon}`,
                        }}
                    >
                        <img src={bodycon} alt="blazer1" />
                        <p class="brand-name">RINI</p>
                        <p class="product-description">Women's Solid White Sleeveless Top & Black Bodycon Skirt</p>
                        <h3 class="product-price">₹3999 <strike>₹4999</strike><p class="discount">(80% off)</p></h3>
                    </Link>

                    <Link
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
                    </a>
                </div>
            </main>
        </>
    )
}

export default Women;