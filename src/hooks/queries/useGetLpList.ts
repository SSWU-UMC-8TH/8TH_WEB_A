import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../types/common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";

function useGetLpList({ cursor, search, order, limit}: PaginationDto) {
  return useQuery({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
    
    // 조건에 따라 쿼리 실행 여부를 결정
    // enabled: Boolean(search), // search가 있을 때만 쿼리 실행
    // keepPreviousData: true, // 이전 데이터를 유지

    select:(data) => data.data.data,
  });
}
export default useGetLpList;