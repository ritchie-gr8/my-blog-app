import { Navigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';

const PublicRoute = ({ children }) => {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute; 