import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRouter';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <RouterProvider router={router} />
    </div>
  );
}
