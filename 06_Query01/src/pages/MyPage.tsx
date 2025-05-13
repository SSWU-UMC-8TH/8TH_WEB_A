import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo } from "../apis/auth";
import { ResponseMyInfoDto } from "../types/auth";

export const MyPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<ResponseMyInfoDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getMyInfo();
        setUserInfo(data);
      } catch (error) {
        console.error("❌ 사용자 정보 불러오기 실패:", error);
        alert("로그인이 만료되었거나 권한이 없습니다.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  if (loading) {
    return <div className="text-center mt-10">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl font-bold mb-4">MyPage</h2>

      {userInfo ? (
        <div className="text-center mb-6">
          <p><strong>이메일:</strong> {userInfo.data.email}</p>
          <p><strong>이름:</strong> {userInfo.data.name}</p>
        </div>
      ) : (
        <p className="text-red-500">사용자 정보를 불러올 수 없습니다.</p>
      )}

      <button
        onClick={handleLogout}
        className="mt-4 px-6 py-2 bg-blue-700 text-white rounded hover:bg-blue-700"
      >
        로그아웃
      </button>
    </div>
  );
};
