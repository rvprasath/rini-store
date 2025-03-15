
import { Link } from "react-router-dom";
import facebookIcon from "../images/facebook-icon.png"
import instagramIcon from "../images/instagram-icon.png"
import youtubeIcon from "../images/youtube-icon.png"

function Footer() {
    return (
        <>
            <footer>
                <div class="footer-sections">
                    <div>
                        <h3>Online Shopping</h3>
                        <p><Link to="/men">Men</Link></p>
                        <p><Link to="/women">Women</Link></p>
                        <p><Link to="/fabrics">Fabrics</Link></p>
                    </div>
                    <div>
                        <h3>Customer Policies</h3>
                        <p>Contact Us</p>
                        <p>FAQs</p>
                        <p>Shipping</p>
                        <p>Track Orders</p>
                        <p>Returns</p>
                        <p>Cancellation</p>
                        <p>Privacy Policies</p>
                    </div>
                    <div>
                        <h3>Keep in Touch</h3>
                        <div class="footer-icons">
                            <img src={instagramIcon} alt="Instagram Icon" />
                            <img src={facebookIcon} alt="Facebook Icon" />
                            <img src={youtubeIcon} alt="YouTube Icon" />
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer;