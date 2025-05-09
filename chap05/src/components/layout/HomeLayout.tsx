// src/components/layout/HomeLayout.tsx
import { Outlet } from "react-router-dom"
import Navbar  from "../Navbar";
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { AuthProvider } from "../../context/AuthContext";

const HomeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthProvider>
      <div className="h-dvh flex flex-col">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 mt-20 bg-black text-white">
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  )
};

export default HomeLayout;
