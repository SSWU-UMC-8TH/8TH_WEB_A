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
import LpDetailPage from '../pages/LpDetailPage';
import LpEditPage from '../pages/LPEditPage'; // ✅ 수정 페이지 import 추가

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
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
      {
        path: 'lp/:id',
        element: (
          <ProtectedRoute>
            <LpDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'lp/edit/:id',
        element: (
          <ProtectedRoute>
            <LpEditPage />
          </ProtectedRoute>
        )
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
