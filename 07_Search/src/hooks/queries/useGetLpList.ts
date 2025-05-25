import { useInfiniteQuery } from "@tanstack/react-query";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { ResponseLPListDto } from "../../types/lp";

interface UseGetLpListParams {
  search: string;
  order: string;
  limit?: number;
  searchType?: "title" | "tag";
}

function useGetLpList({
  search,
  order,
  limit = 4,
  searchType,
}: UseGetLpListParams) {
  return useInfiniteQuery<ResponseLPListDto, Error>({
    queryKey: [QUERY_KEY.lps, search, order, limit, searchType],
    queryFn: ({ pageParam = null }): Promise<ResponseLPListDto> =>
      getLpList({
        cursor: pageParam as number | undefined, // Fix applied here
        search,
        limit
      }),

    getNextPageParam: (lastPage) => {
      console.log("📦 getNextPageParam:", lastPage.data.nextCursor);
      return lastPage.data.nextCursor ?? null;
    },
    initialPageParam: null,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpList;
