// src/pages/MyPage.tsx
import { useEffect, useState, useRef } from "react";
import { getMyInfo } from "../apis/authApi";
import { ResponseMyInfoDto } from "../types/authTypes";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";
import axios from "axios";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [data, setData] = useState<ResponseMyInfoDto | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getMyInfo();
        setData(response);
        setName(response.name);
        setBio("bio" in response ? response.bio ?? "" : "");
      } catch (err) {
        console.error("유저 정보 조회 실패:", err);
        alert("로그인이 만료되었습니다.");
        navigate("/login");
      }
    };

    getData();
  }, [navigate]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      let avatarUrl = data?.avatar ?? "";

      if (avatarFile) {
        const imageForm = new FormData();
        imageForm.append("file", avatarFile);

        const uploadRes = await axiosInstance.post("/v1/uploads", imageForm, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        avatarUrl = uploadRes.data.data.imageUrl;
      }

      const payload: Record<string, any> = { avatar: avatarUrl };
      if (name.trim()) payload.name = name;
      if (bio.trim()) payload.bio = bio;

      const res = await axiosInstance.patch("/v1/users", payload, {
        headers: { "Content-Type": "application/json" },
      });

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setEditMode(false);
    },
  });

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="text-center py-10">
      {data ? (
        <>
          <h1 className="text-2xl font-bold mb-4">마이페이지</h1>
          <div className="relative inline-block">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : data.avatar ?? "/default-avatar.png"}
              alt="프로필 이미지"
              className="mx-auto w-24 h-24 rounded-full mb-2 cursor-pointer"
              onClick={handleImageClick}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) setAvatarFile(e.target.files[0]);
              }}
            />
          </div>

          {editMode ? (
            <>
              <div className="mb-2">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="닉네임"
                  className="border rounded px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="자기소개 (선택)"
                  className="border rounded px-2 py-1 w-full max-w-xs"
                />
              </div>
              <button
                onClick={() => {
                  if (!name.trim()) {
                    alert("닉네임은 필수입니다.");
                    return;
                  }
                  updateMutation.mutate();
                }}
                className="w-full max-w-xs bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                저장하기
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="mt-2 w-full max-w-xs bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
              >
                취소
              </button>
            </>
          ) : (
            <>
              <p className="mb-2 font-semibold">이름: {data.name}</p>
              <p className="mb-2">자기소개: {"bio" in data ? data.bio ?? "(없음)" : "(없음)"}</p>
              <p className="mb-4">이메일: {data.email}</p>

              <button
                onClick={() => setEditMode(true)}
                className="w-full max-w-xs bg-gray-700 text-white py-2 rounded hover:bg-gray-800 mb-4"
              >
                설정 수정
              </button>
              <button
                className="w-full max-w-xs bg-black text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          )}
        </>
      ) : (
        <p className="text-gray-500">내 정보를 불러오는 중...</p>
      )}
    </div>
  );
};

export default MyPage;