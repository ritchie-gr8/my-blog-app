import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();
  const location = useLocation();

  if (loading) {
    return null; // TODO: a loading spinner
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
