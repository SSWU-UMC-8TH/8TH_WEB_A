import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { getLpDetail } from "../../apis/lp";
import { ResponseLPListDto } from "../../types/lp";

const useGetLpDetail = ({ id }: { id: string }) => {
  return useQuery({
    queryKey: [QUERY_KEY.lps, id],
    queryFn: () => getLpDetail(id),
    select: (res) => res.data, // ✅ 여기 중요!
    enabled: !!id,
  });
};

export default useGetLpDetail;
