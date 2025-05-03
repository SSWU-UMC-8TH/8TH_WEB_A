// src/App.tsx
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
