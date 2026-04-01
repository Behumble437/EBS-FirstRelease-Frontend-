import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isAdminRole } from "../utils/roles";

export default function AdminProtectedRoute({ children }) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdminRole(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}