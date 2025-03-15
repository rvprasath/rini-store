import "../css/home.css";
import adBanner from "../images/ad-banner.jpg";
import couponsBackground from "../images/coupons-background.jpg";
import collection1 from "../images/collection1.jpg";
import collection2 from "../images/collection2.jpg";
import collection3 from "../images/collection3.jpg";
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        let start = 0;
        let timeoutId;

        // Function to change the displayed image
        function timeChange() {
            let img = document.getElementsByClassName("myslide");

            // If no images are found, stop the function
            if (img.length === 0) {
                return;
            }

            // Hide all images
            for (let i = 0; i < img.length; i++) {
                img[i].style.display = "none";
            }

            // Update start to cycle through images
            start = (start + 1) % img.length;

            // Show the current image
            img[start].style.display = "block";

            // Set the timeout for the next image change
            timeoutId = setTimeout(timeChange, 2000);
        }

        // Start the image slider function
        timeChange();

        // Cleanup function to clear the timeout when the component unmounts
        return () => {
            clearTimeout(timeoutId); // Clear timeout to stop it when the component unmounts
        };
    }, []);

    return (
        <>
            <div className="section">
                <img src={adBanner} alt="Ad Banner" />
                <div className="section-content">
                    <h1 className="welcome">Welcome to "Rini"</h1>
                    <h3 className="discover">Discover Your Style</h3>
                </div>
            </div>

            <div className="section">
                <img src={couponsBackground} alt="Coupons Background" />
                <div className="section-content">
                    <h1 className="coupons">Coupons Corner</h1>
                    <p>Get the best deals here!</p>
                </div>
            </div>

            <div className="section">
                <div className="section-content">
                    <div className="myslide">
                        <h1 className="latest">Latest Collections PARTY WEAR</h1>
                        <img src={collection1} />
                    </div>
                    <div className="myslide">
                        <h1 className="latest">Latest Collections BLAZERS</h1>
                        <img src={collection2} />
                    </div>
                    <div className="myslide">
                        <h1 className="latest">Latest Collections CORSET</h1>
                        <img src={collection3} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;
