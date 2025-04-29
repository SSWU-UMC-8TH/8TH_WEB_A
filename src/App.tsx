import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import './App.css'
import { HomeLayout } from './layouts/HomeLayout'
import { NotFoundPage } from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { SignupPage } from './pages/SignupPage'
import MyPage from './pages/MyPage'
import { AuthProvider } from './context/AuthContext'
import { ProtectedLayout } from './layouts/ProtectedLayout'

// publicRoutes: 인증없이 접근 가능한 페이지
const publicRoutes:RouteObject[] = [
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
    ]
  }
] //HomeLayout의 Outlet에 렌더링됨 (네비게이션 바가 있음)

// protectedRoutes: 인증이 필요한 페이지
const protectedRoutes:RouteObject[] = [
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      { path: 'my', element: <MyPage /> },
    ]
  }
]

const router = createBrowserRouter([...publicRoutes,...protectedRoutes]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App
