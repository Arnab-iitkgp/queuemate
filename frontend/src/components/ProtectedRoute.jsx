import { FaWindows } from "react-icons/fa";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // If not logged in or role mismatch
  if (!token || !user || !role.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children; // Render protected component
}
