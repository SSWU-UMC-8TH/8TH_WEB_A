import { useState } from "react";
import useGetComments from "../hooks/queries/useGetComments";

export default function CommentSection({ lpId }: { lpId: number }) {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const { data: comments, isLoading, isError } = useGetComments(lpId, order);

  return (
    <div className="mt-8 text-white">
      <div className="flex justify-end mb-4 space-x-2">
        <button
          className={`px-3 py-1 rounded ${
            order === "asc" ? "bg-white text-black" : "bg-gray-600 text-white"
          }`}
          onClick={() => setOrder("asc")}
        >
          오래된순
        </button>
        <button
          className={`px-3 py-1 rounded ${
            order === "desc" ? "bg-white text-black" : "bg-gray-800 text-white"
          }`}
          onClick={() => setOrder("desc")}
        >
          최신순
        </button>
      </div>

      <div className="space-y-4">
        {isLoading && <p>로딩 중...</p>}
        {isError && <p>에러 발생</p>}
        {comments?.map((comment) => (
          <div key={comment.id} className="p-4 bg-gray-800 rounded">
            <div className="text-sm font-semibold">{comment.author.name}</div>
            <div className="text-sm text-gray-300">{comment.content}</div>
            <div className="text-xs text-gray-400">
              {new Date(comment.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-900 rounded">
        <textarea
          placeholder="댓글을 입력하세요..."
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows={3}
          disabled
        />
        <button className="mt-2 px-4 py-2 bg-gray-700 text-white rounded" disabled>
          작성하기
        </button>
      </div>
    </div>
  );
}
