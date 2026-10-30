import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
    const location = useLocation();
    const isAdminPage = location.pathname.startsWith("/admin");
    return (
        <div className={`page-wrapper${isAdminPage ? " admin-app" : ""}`}>

            <Navbar />

            <main className={`main-content${isAdminPage ? " admin-content" : ""}`}>
                {children}
            </main>

            <Footer />

        </div>
    );
}

export default Layout;
