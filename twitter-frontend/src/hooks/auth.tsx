import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }: any) => {
  return isAuthenticated() ? children : <Navigate to="/sign-in" />;
};

const NotAuthenticatedRoute = ({ children }: any) => {
  return isAuthenticated() ? <Navigate to="/home" /> : children;
};

export { ProtectedRoute,NotAuthenticatedRoute };
