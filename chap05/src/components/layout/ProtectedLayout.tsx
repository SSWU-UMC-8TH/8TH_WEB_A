// src/routes/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { JSX } from 'react';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { accessToken } = useAuth();

  // ❌ accessToken이 없으면 로그인 페이지로 이동
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // ✅ accessToken이 있으면 원래 페이지 보여줌
  return children;
}
