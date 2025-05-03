// File: src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { accessToken } = useAuth();

  // accessToken 없으면 로그인 페이지로 이동
  return accessToken ? children : <Navigate to="/login" replace />;
}