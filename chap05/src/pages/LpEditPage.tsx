import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import { axiosInstance } from "../apis/axios";

const LpEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: lp, isLoading, isError } = useGetLpDetail({ id: id as string }, !!id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tags, setTags] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (lp) {
      setTitle(lp.title);
      setContent(lp.content);
      setThumbnail(lp.thumbnail);
      setTags(lp.tags.map((tag) => tag.name).join(", "));
    }
  }, [lp]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title,
        content,
        thumbnail,
        tags: tags.split(",").map((t) => t.trim()),
        published: true,
      };
      const res = await axiosInstance.patch(`/v1/lps/${id}`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", id] });
      navigate(`/lp/${id}`);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axiosInstance.post("/v1/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setThumbnail(res.data.data.imageUrl);
    } catch (error) {
      console.error("썸네일 업로드 실패:", error);
      alert("썸네일 업로드에 실패했습니다.");
    }
  };

  if (isLoading) return <div className="text-white">⏳ 불러오는 중...</div>;
  if (isError || !lp) return <div className="text-white">❌ LP 불러오기 실패</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-xl mt-10">
      <h1 className="text-2xl font-bold mb-4">LP 수정</h1>

      <div className="mb-4">
        <label>제목</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded bg-gray-700"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label>내용</label>
        <textarea
          className="w-full mt-1 p-2 rounded bg-gray-700"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">썸네일</label>

        {thumbnail && (
          <img
            src={thumbnail}
            alt="썸네일 미리보기"
            className="mt-2 h-32 object-cover rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          썸네일 업로드
        </button>
      </div>

      <div className="mb-4">
        <label>태그 (쉼표로 구분)</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded bg-gray-700"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>

      <button
        onClick={() => updateMutation.mutate()}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        저장
      </button>
    </div>
  );
};

export default LpEditPage;
