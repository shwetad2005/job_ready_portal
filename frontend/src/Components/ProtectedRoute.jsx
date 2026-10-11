// Protected Route Component
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();

  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (isLoggedIn !== "true") {
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