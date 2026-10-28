import { Navigate } from "react-router-dom";

function AdminProtectedRoute({ children }) {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
        user = null;
    }

    const isAdmin =
        Boolean(sessionStorage.getItem("authToken")) &&
        user?.role === "ROLE_ADMIN";

    if (!isAdmin) {

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