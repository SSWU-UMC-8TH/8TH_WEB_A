import { Outlet } from "react-router-dom"
import Navbar  from "../components/Navbar.tsx";
import { Footer } from "../components/Footer.tsx";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { LpAddButton } from "../components/AddLpButton.tsx";

export const HomeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-dvh flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 mt-10">
        <LpAddButton />
        <Outlet /> {/* Outlet에는 children들이 렌더링 됨 */}
      </main>
      <Footer />
    </div>
  )
};
