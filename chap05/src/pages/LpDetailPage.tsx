// src/pages/LpDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Heart, Edit, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import CommentSection from "../components/Comment/CommentSection";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../apis/axios";

const LpDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: lp,
    isLoading,
    isError,
  } = useGetLpDetail({ id: id as string }, !!id);

  const isAuthor = user && lp?.author?.id === user.id;
  const liked = user && lp?.likes?.some((like: any) => like.userId === user.id);

  const deleteMutation = useMutation({
    mutationFn: async () => await axiosInstance.delete(`/v1/lps/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      navigate("/");
    },
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (liked) {
        return await axiosInstance.delete(`/v1/lps/${id}/likes`);
      } else {
        return await axiosInstance.post(`/v1/lps/${id}/likes`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", id] });
    },
  });

  if (isLoading)
    return <div className="text-white mt-20">⏳ 로딩 중...</div>;
  if (isError || !lp)
    return (
      <div className="text-white mt-20 text-center">
        ❌ LP를 불러올 수 없습니다.
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white px-4 py-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-gray-900 rounded-xl shadow-lg p-6 relative mb-10">
        {isAuthor && (
          <div className="absolute top-4 right-4 flex gap-3 text-gray-400">
            <button title="수정" onClick={() => navigate(`/lp/edit/${id}`)}>
              <Edit className="w-5 h-5 hover:text-white" />
            </button>
            <button
              title="삭제"
              onClick={() => {
                if (window.confirm("정말 삭제하시겠습니까?")) {
                  deleteMutation.mutate();
                }
              }}
            >
              <Trash className="w-5 h-5 hover:text-red-500" />
            </button>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <img
              src={lp.author?.profileUrl ?? "/default-profile.png"}
              alt="프로필"
              className="w-8 h-8 rounded-full"
            />
            <span className="font-semibold">{lp.author?.name ?? "익명"}</span>
          </div>
          <div className="text-sm text-gray-400">
            {lp.createdAt &&
              formatDistanceToNow(new Date(lp.createdAt), { addSuffix: true })}
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-4">{lp.title}</h1>

        <div className="flex justify-center mb-4">
          <img
            src={lp.thumbnail ?? "/default-thumbnail.jpg"}
            alt={lp.title}
            className="w-72 h-72 object-cover rounded-lg"
          />
        </div>

        <p className="text-gray-200 text-sm leading-relaxed mb-6">{lp.content}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {lp.tags?.map((tag: { id: number; name: string }) => (
            <span
              key={tag.id}
              className="px-3 py-1 bg-gray-700 rounded-full text-sm"
            >
              #{tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-pink-500">
          <button
            onClick={() => user && likeMutation.mutate()}
            title="좋아요"
            className="hover:text-pink-300"
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          </button>
          <span>{lp.likes?.length ?? 0}</span>
        </div>
      </div>

      {user && id && <CommentSection lpId={id as string} currentUserId={user.id} />}
    </div>
  );
};

export default LpDetailPage;