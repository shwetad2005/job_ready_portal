import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <div className="page-wrapper">

            <Navbar />

            <main className="main-content">
                {children}
            </main>

            <Footer />

        </div>
    );
}

export default Layout;