//src/components/Sidebar.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../apis/authApi"; // ✅ 탈퇴 API 함수 이름 수정
import { removeLocalStorage } from "../utils/localStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const withdrawMutation = useMutation({
    mutationFn: deleteUser, // ✅ 수정된 API 함수 사용
    onSuccess: () => {
      removeLocalStorage(LOCAL_STORAGE_KEY.accessToken);
      removeLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
      navigate("/");
    },
  });

  const handleWithdraw = () => {
    withdrawMutation.mutate();
  };

  return (
    <>
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
            찾아보기
          </Link>

          <button
            className="text-left text-gray-400 mt-auto hover:text-white text-sm"
            onClick={() => setShowConfirm(true)}
          >
            탈퇴하기
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-800 text-white p-6 rounded-xl w-[90%] max-w-sm text-center relative">
            <button
              className="absolute top-3 right-3 text-white"
              onClick={() => setShowConfirm(false)}
            >
              ✕
            </button>
            <p className="text-lg mb-4">정말 탈퇴하시겠습니까?</p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
                onClick={handleWithdraw}
              >
                예
              </button>
              <button
                className="bg-pink-500 px-4 py-2 rounded hover:bg-pink-600"
                onClick={() => setShowConfirm(false)}
              >
                아니요
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;