// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMutation } from "@tanstack/react-query";
import { ShoppingCart } from "lucide-react";

type NavbarProps = {
  toggleSidebar: () => void;
};

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { accessToken, logout, user } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      navigate("/");
    },
  });

  // TODO: Redux or Context 에서 실제 cartCount 를 가져오세요.
  const cartCount = 0;

  return (
    <nav className="bg-black fixed top-0 left-0 w-full z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* 왼쪽: 햄버거, 로고 */}
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

          {/* 오른쪽: 검색, 장바구니, 인증 */}
          <div className="flex items-center gap-4">
            <Link
              to="/search"
              className="text-white hover:text-gray-300 transition"
            >
              🔍
            </Link>

            <Link
              to="/cart"
              className="relative text-white hover:text-gray-300 transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-pink-500 text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

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
                <span className="text-sm text-gray-300 font-medium hidden sm:inline">
                  {user?.name ?? "사용자"}님 반갑습니다
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
}
export default Navbar;
