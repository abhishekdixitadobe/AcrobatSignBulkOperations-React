import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated || false);

  if (typeof isAuthenticated !== 'boolean') {
    console.error("isAuthenticated is not a boolean:", isAuthenticated);
    // Optionally, you can return a fallback UI if the authentication status is not a boolean
    return <div>Loading...</div>;
  }
  console.log("isAuthenticated------",isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
