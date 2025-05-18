import React from "react";
import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import CommentSection from "../pages/CommentSection";

const LpDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetLpDetail({ id: id as string });

  if (isLoading) return <div className="text-white">불러오는 중...</div>;
  if (isError || !data) return <div className="text-white">LP 정보를 불러오지 못했습니다.</div>;

  return (
    <div className="flex justify-center items-center p-8 bg-black min-h-screen text-white">
      <div className="max-w-xl w-full text-center">
        <h1 className="text-2xl font-bold mb-10">{data.title}</h1>
        <img
          src={data.thumbnail}
          alt={data.title}
          className="w-64 h-64 object-cover rounded-full mb-10 mx-auto"
        />
        <p className="mb-10">{data.content}</p>

        <div className="flex justify-center items-center gap-4">
          <span className="text-lg">❤️ {data.likes.length}</span>
          <button className="bg-gray-700 px-4 py-1 rounded">수정</button>
          <button className="bg-gray-700 px-4 py-1 rounded">삭제</button>
          <button className="bg-gray-700 px-4 py-1 rounded">좋아요</button>
        </div>

        <CommentSection lpId={Number(id)} />

      </div>
    </div>
  );
};

export default LpDetailPage;
