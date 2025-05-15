import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ResponseMyInfoDto } from "../types/auts";
import { getMyInfo } from "../apis/auts";
import { useLogout } from "../hooks/mutations/useLogout";

type NavbarProps = {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  const { mutate: logoutMutation } = useLogout();
  
    useEffect(() => {
      const getData = async () => {
        try {
      if (!accessToken) return; // ✅ accessToken 없으면 API 호출 안 함
      const response = await getMyInfo();
      console.log(response);
      setData(response);
    } catch (error) {
      console.error('getMyInfo 실패:', error);
    }
  };
      
      getData();
    }, [accessToken])
  
  const handleLogout = async () => {
    try {
      await logoutMutation(); 
      setData(null); 
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 문제가 발생했습니다.");
    }
  }

  return (
    <nav className="bg-black dark:bg-gray-800 shadow-md fixed w-full z-20">
      <div className="flex items-center justify-between p-1">
        <div className="flex items-center gap-2">
            <button
              onClick={toggleSidebar}
              className="text-white px-4 py-2 text-2xl rounded mb-1"
            >
              ☰
            </button>
          <Link
        to="/"
        className="text-white text-xl font-bold rounded hover:bg-gray-800 transition-colors"
          >
        Moca LP
          </Link>
        </div>

        <div className="space-x-4">
          {!accessToken && (   // accessToken이 없으면 로그인, 회원가입 버튼을 보여줌
        <>
          <Link
            to="/login"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            로그인
          </Link>
          <Link
            to="/signup"
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
          >
            회원가입
          </Link>
        </>
          )}
          {accessToken && (  // accessToken이 있으면 로그아웃 보여줌
            <div className="flex justify-between gap-5">
              <div className="text-white text-base mt-3 font-medium whitespace-nowrap">
                {data?.data?.name}님, 반갑습니다.
              </div>
          <button
            className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
          )}
        </div>
      </div>
        
    </nav>
  );
};

export default Navbar;