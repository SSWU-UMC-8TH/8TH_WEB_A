// src/components/layout/HomeLayout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';

export default function HomeLayout() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <main className="w-full px-3 py-8 bg-black">
          <Outlet />
      </main>
    </div>
  );
}
