// src/pages/Home.tsx
import { useState, useEffect, KeyboardEvent } from "react";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LpCardSkeletonList } from "../components/layout/LpCard/LpCardSkeletonList";
import { AddLpModal } from "../components/AddLpModal";
import { useThrottle } from "../hooks/useThrottle"; // ← 추가

export const HomePage = () => {
  // 검색어 입력용 / 실제 검색용 분리 (위 예시에서 설명)
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState(PAGINATION_ORDER.desc);
  const { accessToken } = useAuth() || {};
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 실제 쿼리 호출
  const {
    data,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isPending,
    isError,
  } = useGetInfiniteLpList(10, search, order);

  const { ref, inView } = useInView();

  // 1초에 한 번만 fetchNextPage 실행하도록 throttle
  const throttledFetchNext = useThrottle(fetchNextPage, 1000);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      throttledFetchNext();
    }
  }, [inView, hasNextPage, isFetchingNextPage, throttledFetchNext]);

  const flatData = data?.pages.map((page) => page.data.data).flat() || [];

  if (isPending) return <div className="mt-20 text-white">⏳ 로딩 중입니다...</div>;
  if (isError)
    return <div className="mt-20 text-white">⚠️ 데이터를 불러오는 중 오류가 발생했습니다.</div>;
  if (!flatData.length) return <div className="text-white">🙅 데이터 없음</div>;

  return (
    <div className="relative p-6 bg-black min-h-screen text-white">
      {/* 검색창 / 검색 버튼 / 정렬 버튼 (위 예시 참조) */}

      {/* LP 카드 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {flatData.map((lp) => (
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
            <img
              src={lp.thumbnail}
              alt={typeof lp.title === "string" ? lp.title : String(lp.title)}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end backdrop-blur-sm">
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

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-1" />

      {/* + 버튼 */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-pink-500 text-white text-3xl shadow-lg z-40 hover:bg-pink-600"
      >
        +
      </button>
      {isModalOpen && <AddLpModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default HomePage;
