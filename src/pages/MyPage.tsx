import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auts";
import { RequestUserDto, ResponseMyInfoDto } from "../types/auts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useUpdateUserInfo from "../hooks/mutations/useUpdateUserInfo";
import { uploadImageToServer } from "../apis/lp";

const MyPage = () => {
  const navigate = useNavigate();
  const {logout} = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto>([]);

  const { mutate: updateUserMutate, isPending } = useUpdateUserInfo();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);


  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
        setName(response.data.name);
        setBio(response.data.bio ?? ""); 
      } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
      }
    };

    getData();
  }, [])
  
  const handleLogout = async () => {
    await logout();
    navigate("/");
  }

  const handleSave = async () => {
    let imageUrl = data.data.avatar; 

  if (profileImage) {
    imageUrl = await uploadImageToServer(profileImage);
  }

  const userData: RequestUserDto = {
    name,
    bio,
    avatar: imageUrl, 
  };

  updateUserMutate(userData, {
    onSuccess: () => {
      alert("정보가 성공적으로 수정되었습니다.");
      setIsEditing(false);

      try {
        getMyInfo()
          .then((updatedResponse) => {
            setData(updatedResponse);
          })
          .catch((error) => {
            console.error("업데이트 후 사용자 정보 가져오기 실패:", error);
          });
      } catch (error) {
        console.error("업데이트 후 사용자 정보 가져오기 실패:", error);
      }
    },
    onError: (err) => {
      console.error("유저 정보 수정 실패:", err);
      alert("수정 중 오류가 발생했습니다.");
    },
  });
  }

  if (!data) return <div>로딩 중...</div>;

  return (
    <div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        {!isEditing ? (
          <>
            <div className="text-center">
              <img
                src={data.data?.avatar as string || "/default-profile.png"}
                alt="프로필"
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h2 className="text-xl font-bold">{data.data?.name}</h2>
              <p className="text-gray-600">{data.data?.bio}</p>
              <button
                className="mt-4 px-4 py-2 bg-black text-white rounded"
                onClick={() => setIsEditing(true)}
              >
                설정
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <label className="font-semibold">이름</label>
              <input
                className="p-2 border border-gray-300 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label className="font-semibold">소개</label>
              <textarea
                className="p-2 border border-gray-300 rounded"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />

              <label className="font-semibold">프로필 이미지</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProfileImage(e.target.files[0]);
                  }
                }}
              />

              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                  onClick={handleSave}
                  disabled={isPending}
                >
                  저장
                </button>
                <button
                  className="px-4 py-2 border border-gray-300 rounded"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </>
        )}
        
      </div>
      <button
        className="w-full bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
        onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default MyPage;