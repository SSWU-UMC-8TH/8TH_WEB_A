import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Heart, Edit, Trash } from "lucide-react";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import CommentSection from "../components/Comment/CommentSection";
import { useAuth } from "../context/AuthContext";

const LpDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  console.log("📌 useParams id:", id);

  const {
    data: lp,
    isLoading,
    isError,
  } = useGetLpDetail({ id: id as string }, !!id);

  console.log("📌 useGetLpDetail result:", lp);
  console.log("❗ isError:", isError, "❗ error:", isError);

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
        <div className="absolute top-4 right-4 flex gap-3 text-gray-400">
          <button title="수정">
            <Edit className="w-5 h-5 hover:text-white" />
          </button>
          <button title="삭제">
            <Trash className="w-5 h-5 hover:text-red-500" />
          </button>
        </div>

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
          <Heart className="w-5 h-5" />
          <span>{lp.likes?.length ?? 0}</span>
        </div>
      </div>

      {user && id && <CommentSection lpId={id as string} currentUserId={user.id} />}
    </div>
  );
};

export default LpDetailPage;
