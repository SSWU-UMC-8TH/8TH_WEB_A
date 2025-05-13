// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ResponseMyInfoDto } from "../types/authTypes";
import { getMyInfo } from "../apis/authApi";
import { useMutation } from "@tanstack/react-query";

type NavbarProps = {
  toggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { accessToken, logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>();

  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;
      try {
        const response = await getMyInfo();
        setData(response);
      } catch (err) {
        console.error("🔴 유저 정보 가져오기 실패:", err);
        setData(undefined);
      }
    };
    fetchData();
  }, [accessToken]);

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  return (
    <nav className="bg-black dark:bg-gray-900 fixed top-0 left-0 w-full z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* 왼쪽: 로고 & 메뉴 버튼 */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="text-white text-2xl hover:text-gray-300 focus:outline-none"
            >
              ☰
            </button>
            <Link
              to="/"
              className="text-white text-xl font-semibold hover:text-gray-300 transition"
            >
              빙글빙글엘피😵‍💫
            </Link>
          </div>

          {/* 오른쪽: 인증 버튼 or 유저 정보 */}
          <div className="flex items-center gap-4">
            {!accessToken ? (
              <>
                <Link
                  to="/login"
                  className="text-sm text-white px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="text-sm text-white px-4 py-2 border border-gray-600 rounded-md hover:bg-gray-800 transition"
                >
                  회원가입
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-300 font-medium whitespace-nowrap hidden sm:inline">
                  {data?.name ?? "사용자"}님 반갑습니다
                </span>
                <button
                  onClick={() => logoutMutation.mutate()}
                  className="text-sm bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
