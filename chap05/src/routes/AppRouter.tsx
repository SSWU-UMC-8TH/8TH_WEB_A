// src/routes/AppRouter.tsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '../components/layout/HomeLayout';
import HomePage from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import NotFoundPage from '../pages/NotFoundPage';
import { GoogleLoginRedirectPage } from '../pages/GoogleLoginRedirectPage';
import ProtectedRoute from './ProtectedRoute';
import MyPage from '../pages/MyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />, // 여기서 AuthProvider 감싸기
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
]);
