// File: src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="w-full px-4 py-3 bg-zinc-900 flex justify-between items-center">
      <h1
        className="text-pink-500 font-bold text-xl cursor-pointer"
        onClick={() => navigate('/')}
      >
      
      </h1>

      <div className="flex gap-2">
        {accessToken ? (
          <>
            <button
              onClick={() => navigate('/my')}
              className="bg-black text-white border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              마이페이지
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-black text-white border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition"
            >
              로그인
            </Link>
            <Link
              to="/signup"
              className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
            >
              회원가입
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
