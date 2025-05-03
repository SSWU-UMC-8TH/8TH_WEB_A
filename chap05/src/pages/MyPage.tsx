// src/pages/MyPage.tsx
import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/authApi";
import { ResponseMyInfoDto } from "../types/authTypes";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        console.log(response);
        setData(response);
      } catch (err) {
        console.error("유저 정보 조회 실패:", err);
        alert("로그인이 만료되었습니다.");
        navigate("/login");
      }
    };

    getData();
  }, [navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="text-center py-10">
      {data ? (
        <>
          <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
          <img
            src={data.avatar ?? "/default-avatar.png"}
            alt="프로필 이미지"
            className="mx-auto w-24 h-24 rounded-full mb-4"
          />
          <p className="mb-2 font-semibold">이름: {data.name}</p>
          <p className="mb-4">이메일: {data.email}</p>

          <button
            className="w-full max-w-xs bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </>
      ) : (
        <p className="text-gray-500">내 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default MyPage;

