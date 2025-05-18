import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../types/Common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { ResponseLPListDto, Lp } from "../../types/lpTypes";

function useGetLpList({ cursor, search, order, limit }: PaginationDto) {
  return useQuery<ResponseLPListDto, Error, Lp[]>({
    queryKey: [QUERY_KEY.lps, search, order],
    queryFn: () =>
      getLpList({
        cursor,
        search,
        order,
        limit,
      }),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,

    select: (res): Lp[] => {
      console.log("🔥 LP 리스트 응답:", res);
      console.log("✅ 내부 데이터 확인:", res.data); // 추가
      return Array.isArray(res.data) ? res.data : res.data.data ?? res.data.items ?? [];
    }
  });
}

export default useGetLpList;