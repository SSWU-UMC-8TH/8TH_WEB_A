// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { accessToken } = useAuth();
  return accessToken ? children : <Navigate to="/login" replace />;
}
