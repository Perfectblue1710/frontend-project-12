import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  console.log('ProtectedRoute', { isAuthenticated });
  
  // Если не авторизован - редирект на логин
  if (!isAuthenticated) {
    console.log('Redirecting to /login');
    return <Navigate to="/login" replace />;
  }
  
  console.log('Rendering protected content');
  return children;
};

export default ProtectedRoute;
