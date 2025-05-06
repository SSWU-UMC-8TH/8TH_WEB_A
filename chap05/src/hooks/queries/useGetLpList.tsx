import {useQuery} from "@tanstack/react-query";
import { PaginationDto} from "../../types/Common";
import { QUERY_KEY } from "../../constants/key";
import { getLPList } from "../../apis/lp";
import { RseponseLpListDto } from "../../types/lpTypes";


function useGetLPList({cursor, search, order, limit}: PaginationDto) {
    return useQuery({
        queryKey: [QUERY_KEY.lps,search, order],
        queryFn: () => 
            getLPList({
                cursor, search, order, limit
         }),

         staleTime: 1000 * 60 * 5, // 5분
         gcTime: 1000 * 60 * 10, // 10분

         select: (data : RseponseLpListDto) => data.data,
    });
};

export default useGetLPList;