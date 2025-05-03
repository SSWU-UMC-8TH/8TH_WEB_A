import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import HomeLayout from './layouts/HomeLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import { OAuthCallbackPage } from "./components/OAuthCallbackPage";


const router = createBrowserRouter([
  // ✅ 최상단에 따로 등록
  {
    path: "v1/auth/google/callback",
    element: <OAuthCallbackPage />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      {
        path: "mypage",
        element: (
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);



function App() {
  return <RouterProvider router={router} />;
}

export default App;
