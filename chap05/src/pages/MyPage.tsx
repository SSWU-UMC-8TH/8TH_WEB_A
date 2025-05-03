import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/authApi";
import { ResponseMyInfoDto } from "../types/authTypes";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout, accessToken } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

  useEffect(() => {
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

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
  }, [accessToken, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/"); // ❗ navigate 빠졌던 부분 추가
  };

  return (
    <div>
      <h1>이름: {data?.name}</h1>
      <img src={data?.avatar ?? '/default-avatar.png'} alt="프로필 이미지" />
      <h1>이메일: {data?.email}</h1>

      <button
        className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default MyPage;
