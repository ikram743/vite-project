// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
  allowedRole?: "donor" | "beneficiary" | "admin";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRole }) => {
  // In a real app, get user from context / Redux / localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in
  if (!user.token) {
    return <Navigate to="/auth?mode=signin" replace />;
  }

  // Check role if specified
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />; // or to unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
