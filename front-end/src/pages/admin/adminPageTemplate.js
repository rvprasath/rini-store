import { Outlet } from "react-router-dom";
import Footer from "../footer"
import AdminHeader from "../admin/adminheader";

function AdminPageTemplate() {
    return (
        <>
            <AdminHeader />
            <Outlet />
            <Footer />
        </>
    )
}

export default AdminPageTemplate;