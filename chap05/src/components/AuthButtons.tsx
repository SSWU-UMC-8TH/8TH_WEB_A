import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthButtons() {
  const { accessToken, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="flex gap-2">
      {accessToken ? (
        <>
          <button
            onClick={() => navigate('/my')}
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            마이페이지
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            로그아웃
          </button>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="bg-white text-black px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            회원가입
          </Link>
        </>
      )}
    </div>
  );
}
