// src/components/Navbar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    // 전체 배경용 컨테이너
    <nav className="w-full px-2 py-3">
      {/* 💡 내용만 본문 폭에 맞춰 중앙 정렬 */}
      <div className="max-w-screen-xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-pink-500 hover:opacity-80 transition"
        >
          SpinningSpinning Dolimpan
        </Link>

        <div className="flex items-center space-x-6">
          {!accessToken ? (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="text-gray-300 hover:text-white transition"
              >
                회원가입
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/my')}
                className="text-gray-300 hover:text-white transition"
              >
                마이페이지
              </button>
              <Link
                to="/search"
                className="text-gray-300 hover:text-white transition"
              >
                검색
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white transition"
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
