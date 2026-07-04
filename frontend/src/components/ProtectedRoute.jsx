import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");

  if (!token || !userJson || userJson === "undefined") {
    return <Navigate to="/login" replace />;
  }

  let user;
  try {
    user = JSON.parse(userJson);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  const userRole = String(user?.role || "").toLowerCase();

  if (allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles.map((role) =>
      String(role).toLowerCase(),
    );

    if (!normalizedAllowedRoles.includes(userRole)) {
      return <Navigate to="/home" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
