// src/routes/AppRouter.tsx
import React from 'react';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import HomeLayout from '../components/layout/HomeLayout';
import HomePage from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFoundPage from '../pages/NotFoundPage';
import { GoogleLoginRedirectPage } from '../pages/GoogleLoginRedirectPage';
import ProtectedRoute from './ProtectedRoute';
import MyPage from '../pages/MyPage';
import { AuthProvider } from '../context/AuthContext';

// 전체를 AuthProvider로 감싸고 HomeLayout 내에서 페이지 분기
export const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        element: <HomeLayout />, // HomeLayout 안에 <Outlet />이 있음
        children: [
          { index: true, element: <HomePage /> },
          { path: 'login', element: <Login /> },
          { path: 'signup', element: <Signup /> },
          { path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage /> },
          {
            path: 'my',
            element: (
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            ),
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
