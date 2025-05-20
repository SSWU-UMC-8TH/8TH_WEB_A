import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LpCardSkeletonList } from "../components/layout/LpCard/LpCardSkeletonList";
import { useDebounce } from "../hooks/useDebounce";

export default function SearchPage() {
  const [searchInput, setSearchInput] = useState<string>("");               // 사용자가 입력하는 값
  const debouncedSearch = useDebounce<string>(searchInput, 500);           // 500ms 디바운스
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const { accessToken } = useAuth() || {};
  const navigate = useNavigate();

  // debouncedSearch 가 바뀔 때만 쿼리 재실행
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteLpList(10, debouncedSearch, order);

  const { ref, inView } = useInView();
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading)
    return <div className="mt-20 text-white">⏳ 로딩 중...</div>;
  if (isError)
    return <div className="mt-20 text-white">⚠️ 검색 중 오류가 발생했습니다.</div>;

  const flatData = data?.pages.flatMap(page => page.data.data) || [];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-4">🔍 LP 검색</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <div className="flex space-x-2">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-4 py-2 rounded ${
              order === PAGINATION_ORDER.asc ? "bg-white text-black" : "bg-gray-700"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-4 py-2 rounded ${
              order === PAGINATION_ORDER.desc ? "bg-white text-black" : "bg-gray-700"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {flatData.map(lp => (
          <div
            key={lp.id}
            className="relative group rounded-lg overflow-hidden cursor-pointer shadow-md hover:shadow-xl transform transition-all duration-300 hover:scale-105"
            onClick={() => {
              if (accessToken) {
                navigate(`/lp/${lp.id}`);
              } else if (window.confirm("로그인이 필요합니다. 로그인하시겠습니까?")) {
                navigate("/login");
              }
            }}
          >
            <img src={lp.thumbnail} alt={lp.title} className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
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
}
