// src/hooks/queries/useGetLpDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { QUERY_KEY } from "../../constants/key";
import { ResponseLpDetailDto } from "../../types/lpTypes";

const useGetLpDetail = ({ id }: { id: string; }, p0: boolean) => {
  return useQuery<ResponseLpDetailDto, Error, ResponseLpDetailDto["data"]>({
    queryKey: [QUERY_KEY.lps, id],
    queryFn: () => getLpDetail(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export default useGetLpDetail;