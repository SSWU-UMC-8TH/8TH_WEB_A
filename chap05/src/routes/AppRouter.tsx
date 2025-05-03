// File: src/routes/AppRouter.tsx
import { createBrowserRouter } from 'react-router-dom';
import HomeLayout from '../components/layout/HomeLayout';
import HomePage from '../pages/Home';
import MyPage from '../pages/MyPage';
import NotFoundPage from '../pages/NotFoundPage';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <HomePage /> },

      // 🔐 로그인 & 회원가입도 HomeLayout 내에서 렌더링
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },

      // 🔒 보호된 페이지
      {
        path: 'my',
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },

      // ❌ 404 페이지
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
