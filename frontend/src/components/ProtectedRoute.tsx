// components/ProtectedRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { getAccessToken, isTokenExpired } from '../utils/auth';

const ProtectedRoute = () => {
  const token = getAccessToken();
  const isAuthenticated = token && !isTokenExpired(token);

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
