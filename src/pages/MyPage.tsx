import { useEffect, useState } from "react";
import { getMyInfo } from "../apis/auts";
import { RequestUserDto, ResponseMyInfoDto } from "../types/auts";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useUpdateUserInfo from "../hooks/mutations/useUpdateUserInfo";
import { uploadImageToServer } from "../apis/lp";

const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);

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
    let imageUrl = data?.data.avatar;

    if (profileImage) {
      imageUrl = await uploadImageToServer(profileImage);
    }

    const userData: RequestUserDto = {
      name,
      bio,
      avatar: imageUrl ?? null,
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-10">
        {!isEditing ? (
          <>
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mb-4">
                <img
                  src={data.data?.avatar as string || "/default-profile.png"}
                  alt="프로필"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{data.data?.name}</h2>
              <p className="text-gray-500 mt-2 text-center whitespace-pre-wrap">{data.data?.bio}</p>
              <button
                className="mt-5 px-6 py-2 bg-black hover:bg-black-700 text-white rounded-lg transition"
                onClick={() => setIsEditing(true)}
              >
                ✏️ 프로필 수정
              </button>
            </div>
          </>
        ) : (
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">이름</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">소개</label>
              <textarea
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">프로필 이미지</label>
              <input
                type="file"
                accept="image/*"
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setProfileImage(e.target.files[0]);
                  }
                }}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                disabled={isPending}
              >
                저장
              </button>
              <button
                type="button"
                className="px-5 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition"
                onClick={() => setIsEditing(false)}
              >
                취소
              </button>
            </div>
          </form>
        )}
      </div>

      <button
        className="mt-6 w-full max-w-md bg-black text-white py-3 rounded-xl text-lg font-semibold hover:bg-gray-800 transition"
        onClick={handleLogout}
      >
        로그아웃
      </button>
    </div>
  );
}

export default MyPage;