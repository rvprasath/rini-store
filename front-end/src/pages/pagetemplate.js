import { Outlet } from "react-router-dom";
import Footer from "./footer"
import Header from "./header";

function PageTemplate() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    )
}

export default PageTemplate;