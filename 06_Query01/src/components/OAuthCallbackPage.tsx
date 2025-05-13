import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const OAuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      navigate("/mypage");
    } else {
      alert("구글 로그인 실패");
      navigate("/login");
    }
  }, []);

  return <div>구글 로그인 처리 중...</div>;
};
