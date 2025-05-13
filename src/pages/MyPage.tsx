import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auts";
import { ResponseMyInfoDto } from "../types/auts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  useEffect(() => {
    const getData = async () => {
      const response = await getMyInfo();
      console.log(response);

      setData(response);
    };

    getData();
  }, [])
  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  }

  return (
    <div>
      <h1>이름: {data.data?.name}</h1>
      <img src={data.data?.avatar as string} alt={"구글 로고"} />
      <h1>이메일: {data.data?.email}</h1>

      <button
        className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default MyPage;