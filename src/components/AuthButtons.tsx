import { Link } from 'react-router-dom';

export default function AuthButtons() {
  return (
    <div className="flex gap-4">
      <Link
        to="/login"
        className="text-sm bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition"
      >
        로그인
      </Link>
      <Link
        to="/signup"
        className="text-sm bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
      >
        회원가입
      </Link>
    </div>
  );
}
