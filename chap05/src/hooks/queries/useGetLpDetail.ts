// src/hooks/queries/useGetLpDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { ResponseLpDetailDto } from "../../types/lpTypes";

const useGetLpDetail = ({ id }: { id: string }) => {
  return useQuery<ResponseLpDetailDto, Error, ResponseLpDetailDto["data"]>({
    queryKey: [QUERY_KEY.lps, id],
    queryFn: () => getLpDetail(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export default useGetLpDetail; // ✅ 이 줄이 반드시 존재해야 한다!!!
