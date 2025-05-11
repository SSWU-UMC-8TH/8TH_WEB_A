// File: src/pages/Home.tsx
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LpCardSkeletonList } from "../components/layout/LpCard/LpCardSkeletonList";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(PAGINATION_ORDER.desc);
  const { accessToken } = useAuth() || {};
  const navigate = useNavigate();

  const {
    data,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
  } = useGetInfiniteLpList(10, search, order);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatData = data?.pages.map((page) => page.data.data).flat() || [];

  if (isPending)
    return <div className="mt-20 text-white">⏳ 로딩 중입니다...</div>;
  if (isError)
    return (
      <div className="mt-20 text-white">⚠️ 데이터를 불러오는 중 오류가 발생했습니다.</div>
    );
  if (!flatData || flatData.length === 0)
    return <div className="text-white">🙅 데이터 없음</div>;

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="검색어 입력"
          className="mb-3 sm:mb-0 px-4 py-2 rounded text-black"
        />
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 rounded ${
              order === "asc" ? "bg-white text-black" : "bg-gray-700"
            }`}
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
          >
            오래된순
          </button>
          <button
            className={`px-4 py-2 rounded ${
              order === "desc" ? "bg-white text-black" : "bg-gray-700"
            }`}
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {flatData.map((lp) => (
          <div
            key={lp.id}
            className="relative group rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              if (accessToken) {
                navigate(`/lp/${lp.id}`);
              } else {
                if (window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?")) {
                  navigate("/login");
                }
              }
            }}
          >
            <img
              src={lp.thumbnail}
              alt={typeof lp.title === "string" ? lp.title : String(lp.title ?? "Untitled")}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-3 flex flex-col justify-end backdrop-blur-sm">
              <h3 className="text-lg font-semibold truncate text-white drop-shadow-md">
                {lp.title}
              </h3>
              <p className="text-sm text-gray-300 drop-shadow">
                {new Date(lp.createdAt).toLocaleDateString("ko-KR")}
              </p>
              <p className="text-sm text-gray-200">🩵 {lp.likes?.length ?? 0}</p>
            </div>
          </div>
        ))}
        {isFetchingNextPage && <LpCardSkeletonList count={10} />}
      </div>

      <div ref={ref} className="h-1" />
    </div>
  );
};

export default HomePage;
