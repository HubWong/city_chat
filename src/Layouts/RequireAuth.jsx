// components/RequireAuth.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useReduxAuth } from "../hooks/useReduxAuth";

const RequireAuth = ({ children, allowedRoles=null }) => {
  const { isLogout, user } = useReduxAuth();
  const location = useLocation();

  if (isLogout) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RequireAuth;
