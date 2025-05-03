// HomeLayout.tsx
import { Outlet } from 'react-router-dom';
import Header from '../Header';

export default function HomeLayout() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Header />
      <main className="px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}