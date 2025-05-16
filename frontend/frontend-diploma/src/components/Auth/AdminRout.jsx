import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AdminRoute = () => {
  const token = localStorage.getItem('access_token');

  if (!token) return <Navigate to="/login" replace />;

  const decoded = jwtDecode(token);
  const isAdmin = decoded.is_superuser === true;

  return isAdmin ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default AdminRoute;
