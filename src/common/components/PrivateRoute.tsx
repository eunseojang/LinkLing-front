import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/AuthStore";

interface PrivateRouteProps {
  element: JSX.Element;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
