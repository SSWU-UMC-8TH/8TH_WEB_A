import { useQuery } from "@tanstack/react-query";
import { getLpDetail } from "../../apis/lp";
import { LPDetail } from "../../types/lp";
import { QUERY_KEY } from "../../constants/key";


const useGetLpDetail = ({ id }: { id: string }) => {
    return useQuery<LPDetail>({
        queryKey: [QUERY_KEY.lps, id],
        queryFn: async () => {
          const res = await getLpDetail(id);
          return res.data.data;
        },
        enabled: !!id,
      });      
};

export default useGetLpDetail;

