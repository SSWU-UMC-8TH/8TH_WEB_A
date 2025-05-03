// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Header from './Header'; 

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header /> {/* ✅ 로그인 상태에 따라 버튼 표시 */}
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}


