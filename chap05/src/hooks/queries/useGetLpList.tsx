import { useQuery } from "@tanstack/react-query";
import { PaginationDto } from "../../types/Common";
import { getLpList } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { Lp, ResponseLPListDto } from "../../types/lpTypes";

function useGetLpList(params: PaginationDto) {
  return useQuery<ResponseLPListDto, Error, Lp[]>({
    queryKey: [QUERY_KEY.lps, params.search, params.order],
    queryFn: () => getLpList(params),

    select: (data) => {  console.log("👉 API 응답 구조", data);
         return data.data.data; },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}

export default useGetLpList;
