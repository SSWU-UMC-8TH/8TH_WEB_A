import { Outlet } from "react-router-dom"
import Navbar  from "../components/Navbar.tsx";
import { Footer } from "../components/Footer.tsx";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { LpAddButton } from "../components/AddLpButton.tsx";
import { deleteUser } from "../apis/auts.ts";
import WithdrawalModal from "../components/Modals/WithdrawalModal.tsx";

export const HomeLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleWithdraw = async () => {
    try {
      await deleteUser();
      alert("탈퇴되었습니다.");
      window.location.href = "/";
    } catch (error) {
      console.error("탈퇴 실패:", error);
      alert("탈퇴 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="h-dvh flex flex-col">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onWithdrawClick={() => setIsModalOpen(true)} // ✅ 모달 열기 함수 넘김
      />
      <main className="flex-1 mt-10">
        <LpAddButton />
        <Outlet /> {/* Outlet에는 children들이 렌더링 됨 */}
      </main>
      <Footer />

      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleWithdraw}
      />
    </div>
  )
};
