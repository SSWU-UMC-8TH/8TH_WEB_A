import { useEffect, useState } from "react";
import { PAGINATION_ORDER } from "../enums/common";
import useGetInfiniteLpList from "../hooks/queries/useGetInfiniteLpList";
import { useInView } from "react-intersection-observer";
import LpCard from "../components/LpCard/LpCard";
import LpCardSkeletonList from "../components/LpCard/LpCardSkeletonList";
import useDebounce from "../hooks/useDebounce";
import { SEARCH_DEBOUNCE_DELAY } from "../constants/delay";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const debouncedValue = useDebounce(search, SEARCH_DEBOUNCE_DELAY);
  // const { data, isPending, isError } = useGetLpList({
  //   search,
  //   order,
  //   limit: 50,
  // });

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError
  } = useGetInfiniteLpList(10, debouncedValue ?? "", order)

  // ref :  특정한 HTML 요소를 감시할 수 있다
  // inView : 감시하고 있는 요소가 화면에 보이면 true, 아니면 false
  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  },[inView, isFetching, hasNextPage, fetchNextPage])

  if (isError) return <div className="mt-20 text-white">Error...</div>;

  console.log(lps);

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* 정렬 버튼 */}
      <div className="flex justify-end mb-4 space-x-2">
        <input
          className={"border p-2 rounded-sm"}
          placeholder={"검색어를 입력하세요."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={`px-4 py-1 rounded ${
            order === "asc" ? "bg-white text-black" : "bg-gray-700 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
        >
          오래된순
        </button>
        <button
          className={`px-4 py-1 rounded ${
            order === "desc" ? "bg-white text-black" : "bg-gray-700 text-white"
          }`}
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
        >
          최신순
        </button>
      </div>

      {/* LP 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isPending && <LpCardSkeletonList count={20} />}
        {lps?.pages?.map((page) => page.data.data)
          ?.flat()
          ?.map((lp) => (
            <LpCard key={lp.id} lp={lp} />
          ))}
        {isFetching &&  <LpCardSkeletonList count={20} />}
      </div>
      <div ref={ref} className="h-2"/>
    </div>
  );
};

