// Protected Route Component
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const isLoggedIn = sessionStorage.getItem("authToken");

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        state={{ redirectTo: `${location.pathname}${location.search}` }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;