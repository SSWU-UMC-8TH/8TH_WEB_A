import { Link, Outlet, useLocation } from "react-router-dom";
import { Search, User, Menu } from "lucide-react";
import { useState } from "react";


const HomeLayout = () => {
  const location = useLocation();
  const path = location.pathname;
  const username = localStorage.getItem("username") || "사용자";

  const isLoggedInPath =
    path.startsWith("/home") || path.startsWith("/mypage") || path.startsWith("/lp");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 bg-black border-b border-gray-600 text-gray-300 text-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          {isLoggedInPath && (
            <button
            className="mr-4"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu className="w-6 h-6" />
          </button>
          
          )}
          <h1 className="m-0">Spinning-Spinning Dolimpan</h1>
        </div>

        {isLoggedInPath ? (
        <div className="flex items-center gap-6">
          <Search className="w-5 h-5 lg:block" />
          <span className="lg:block">{username}님 반갑습니다</span>
          <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded lg:block">
            로그아웃
          </button>
        </div>
        ) : (
          <nav className="flex gap-8">
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </nav>
        )}
    </div>
    </header>

    <div className="flex flex-1">
    {isLoggedInPath && isSidebarOpen && (
    <aside className="w-[900px] bg-gray-800 text-white p-6 transition-all duration-300">
    <ul className="space-y-4 mt-16">
      <li>
        <Link to="/home" className="flex items-center gap-2 hover:text-gray-300">
          <Search className="w-5 h-5" />
          <span className="text-s">찾기</span>
        </Link>
      </li>
      <li>
        <Link to="/mypage" className="flex items-center gap-2 hover:text-gray-300">
          <User className="w-5 h-5" />
          <span className="text-s">마이페이지</span>
        </Link>
      </li>
    </ul>
    </aside>
    )}
  <main className="flex-grow transition-all duration-400">
    <Outlet />
  </main>
</div>

      {/* 푸터 */}
      <footer className="bg-black py-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Spinning-Spinning Dolimpan</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Terms of Service</Link>
            <Link to="#">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeLayout;
