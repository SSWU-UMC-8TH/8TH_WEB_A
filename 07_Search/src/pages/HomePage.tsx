import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import useGetLpList from "../hooks/queries/useGetLpList";
import { PAGINATION_ORDER } from "../types/common";
import useThrottle from "../hooks/useThrottle";
import { LP } from "../types/lp";
import { useInView } from "react-intersection-observer";

const SEARCH_KEY = "recent_searches";

const getRecentSearches = () => JSON.parse(localStorage.getItem(SEARCH_KEY) || "[]");
const setRecentSearches = (keyword: string) => {
  const prev = getRecentSearches();
  const updated = [keyword, ...prev.filter((k: string) => k !== keyword)].slice(0, 5);
  localStorage.setItem(SEARCH_KEY, JSON.stringify(updated));
};

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [searchType, setSearchType] = useState<"title" | "tag">("title");
  const [confirmedSearch, setConfirmedSearch] = useState(""); 
  const [recentSearches, setRecentSearchesState] = useState<string[]>(getRecentSearches());

  const debouncedSearch = useDebounce(search, 500);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    setConfirmedSearch(debouncedSearch);
    setRecentSearches(debouncedSearch);
    setRecentSearchesState(getRecentSearches());
  };

  const { ref, inView } = useInView();

  const {
    data,
    isPending,
    isError,
    fetchNextPage,         // ✅ 다음 페이지 불러오기
    hasNextPage,           // ✅ 다음 페이지 존재 여부
    isFetchingNextPage     // ✅ 중복 요청 방지용
  } = useGetLpList({
    search: confirmedSearch,
    order,
  });

  const throttledScroll = useThrottle(() => {
    console.log("스크롤 위치:", window.scrollY);
  }, 300);

  useEffect(() => {
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [throttledScroll]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="p-8 bg-black min-h-screen text-white">
      <form onSubmit={handleSearch} className="flex flex-col mb-6 space-y-2">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`${searchType === "title" ? "제목" : "태그"}로 검색...`}
            className="flex-1 px-4 py-2 rounded-md bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value as "title" | "tag")}
            className="px-2 py-2 bg-gray-800 rounded-md text-white focus:outline-none"
          >
            <option value="title">제목</option>
            <option value="tag">태그</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md text-black font-bold"
          >
            검색
          </button>
        </div>

        {recentSearches.length > 0 && (
          <div className="text-sm text-gray-400">
            <p className="mb-1">최근 검색어:</p>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((keyword, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearch(keyword);
                    setRecentSearches(keyword);
                    setRecentSearchesState(getRecentSearches());
                  }}
                  className="bg-gray-600 hover:bg-gray-500 px-2 py-1 rounded text-white text-xs"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>

      <div className="flex justify-end mb-4 space-x-2">
        <button
          className={`px-4 py-1 rounded ${
            order === "asc" ? "bg-white text-black" : "bg-gray-600 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
        >
          오래된순
        </button>
        <button
          className={`px-4 py-1 rounded ${
            order === "desc" ? "bg-white text-black" : "bg-gray-800 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
        >
          최신순
        </button>
      </div>

      {isPending && <div className="mt-20">Loading...</div>}
      {isError && <div className="mt-20">Error...</div>}

      <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
  {data?.pages
    .flatMap((page, pageIndex) => {
      console.log(`📄 Page ${pageIndex + 1}`, page);

      const lpList = page.data.data as LP[];
      console.log(`🧩 LP List from Page ${pageIndex + 1}:`, lpList);

      return lpList;
    })
    .map((lp) => (
      <div
        key={lp.id}
        onClick={() => navigate(`/lp/${lp.id}`)}
        className="relative group overflow-hidden rounded-md shadow-md hover:scale-105 transition-transform duration-300 bg-black cursor-pointer"
      >
        <img
          src={lp.thumbnail}
          alt={lp.title}
          className="w-full h-64 object-cover bg-black"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-semibold">{lp.title}</h3>
          <p className="text-sm">
            {formatDistanceToNow(new Date(lp.createdAt), { addSuffix: true })}
          </p>
          <p className="text-sm">❤️ {lp.likes.length}</p>
        </div>
      </div>
    ))}
</div>
{hasNextPage && (
  <div ref={ref} className="h-10" />
)}
    </div>
  );
};
