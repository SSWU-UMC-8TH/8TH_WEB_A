// src/routes/AppRouter.tsx
import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '../components/layout/HomeLayout';
import HomePage from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Search from '../pages/Search';
import CartPage from '../pages/CartPage';
import NotFoundPage from '../pages/NotFoundPage';
import { GoogleLoginRedirectPage } from '../pages/GoogleLoginRedirectPage';
import ProtectedRoute from './ProtectedRoute';
import MyPage from '../pages/MyPage';
import LpDetailPage from '../pages/LpDetailPage';
import LpEditPage from '../pages/LpEditPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      // 메인 페이지
      { index: true, element: <HomePage /> },

      // 인증 관련
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'v1/auth/google/callback', element: <GoogleLoginRedirectPage /> },

      // 검색 & 장바구니 (비회원도 접근 가능)
      { path: 'search', element: <Search /> },
      { path: 'cart', element: <CartPage /> },

      // 회원 전용
      {
        path: 'my',
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },

      // LP 상세 조회 & 수정 (회원 전용)
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
        ),
      },

      // 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
