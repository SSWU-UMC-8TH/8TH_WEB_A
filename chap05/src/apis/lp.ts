//src/types/lp.ts
// LP 관련 API 호출을 위한 axios 인스턴스 설정
import { PaginationDto } from "../types/Common";
import { ResponseLPListDto } from "../types/lpTypes";
import { axiosInstance } from "./axios";


export const getLpList = async (
    paginationDto: PaginationDto
  ): Promise<ResponseLPListDto> => {
    console.log("📡 getLpList 요청 params:", paginationDto); // 디버깅용
    const { data } = await axiosInstance.get("/v1/lps", {
      params: paginationDto,
    });
    return data;
  };

export const getLpDetail = async (
  id: string
): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};
