import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

const ProtectedRoute = () => {
  const { user, loading } = useUser();

  if (loading) return null;

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
