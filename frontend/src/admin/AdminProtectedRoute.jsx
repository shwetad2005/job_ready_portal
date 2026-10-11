import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {

    const admin =
        localStorage.getItem("admin");

    if (!admin) {

        return (
            <Navigate
                to="/admin/login"
                replace
            />
        );

    }

    return children;
}

export default AdminProtectedRoute;