import { useNavigate } from "react-router-dom";

export const MyPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); 
    navigate("/login"); 
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">MyPage</h2>

      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-700"
      >
        로그아웃
      </button>
    </div>
  );
};
