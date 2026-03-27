import { Navigate, useLocation } from 'react-router-dom';
import { getStoredUser } from '../services/api';

function ProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const user = getStoredUser();

  if (!user?.token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
