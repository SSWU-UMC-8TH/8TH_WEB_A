import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  onWithdrawClick: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onWithdrawClick }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-45 bg-black shadow-lg transform transition-transform duration-300 z-10 ${
      isOpen ? "translate-x-0" : "-translate-x-full"
      } hidden md:block`}
    >
      <div className="flex justify-end p-4">
      <button onClick={onClose}>
        <X className="w-6 h-6" />
      </button>
      </div>
      <div className="flex flex-col items-start gap-4 px-6 mt-4">
      <Link
        to="/my"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors w-full"
        onClick={onClose}
      >
        마이페이지
      </Link>
      <Link
        to="/search"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors w-full"
        onClick={onClose}
      >
        🔍 
      </Link>
      </div>

      <div className="px-6 mt-auto mb-4">
        <button
          onClick={onWithdrawClick}
          className="text-red-600 border border-red-600 px-4 py-2 rounded-xl hover:bg-red-50 w-full"
        >
          탈퇴하기
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
