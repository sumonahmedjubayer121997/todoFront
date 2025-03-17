import { Navigate, Outlet } from 'react-router-dom';

// Function to check authentication
const isAuthenticated = () => {
  const token = localStorage.getItem('token'); // ✅ Check if token exists
  return !!token; // ✅ Returns true if token is present
};

const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
