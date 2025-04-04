import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AuthButtons from './AuthButtons'; 

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="absolute top-4 right-6">
        <AuthButtons /> 
      </div>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}
