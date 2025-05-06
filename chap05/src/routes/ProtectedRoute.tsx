// src/routes/ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const { accessToken, loading } = useAuth();

  // 1) 초기 로딩 중에는 로딩 UI 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 2) accessToken이 있으면 자식 컴포넌트 렌더, 없으면 /login으로 리다이렉트
  return accessToken
    ? <>{children}</>
    : <Navigate to="/login" replace />;
}
