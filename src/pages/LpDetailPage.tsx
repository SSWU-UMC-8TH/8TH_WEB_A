// src/pages/LpDetailPage.tsx
import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";

const LpDetailPage = () => {
  const { id } = useParams();

  const { data, isLoading, isError } = useGetLpDetail({ id: id as string });

  if (isLoading) return <div className="text-white">불러오는 중...</div>;
  if (isError || !data) return <div className="text-white">LP 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div>
        <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-64 h-64 object-cover rounded mb-4"
        />
        <p className="mb-4">{data.content}</p>


        <div className="flex items-center gap-4">
          <span className="text-lg">❤️ {data.likes.length}</span>
          <button className="bg-gray-700 px-4 py-1 rounded">수정</button>
          <button className="bg-gray-700 px-4 py-1 rounded">삭제</button>
          <button className="bg-pink-600 px-4 py-1 rounded">좋아요</button>
        </div>
      </div>
    </div>
  );
};

export default LpDetailPage;
