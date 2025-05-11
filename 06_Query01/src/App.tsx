import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import './App.css';

import HomeLayout from './layouts/HomeLayout';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { MyPage } from './pages/MyPage';
import LpDetailPage  from './pages/LpDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute'; 
import { OAuthCallbackPage } from "./components/OAuthCallbackPage";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "v1/auth/google/callback",
    element: <OAuthCallbackPage />,
  },
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <LoginPage /> },
      { path: "home", element: <HomePage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "lp/:id", 
      element:     
      <ProtectedRoute>
        <LpDetailPage />
      </ProtectedRoute> },
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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
