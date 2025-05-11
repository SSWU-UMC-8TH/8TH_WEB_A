//lp.ts
import { PaginationDto } from "../types/Common";
import { ResponseLPListDto, ResponseLpDetailDto } from "../types/lpTypes";
import { axiosInstance } from "./axios";

export const getLpList = async (
  paginationDto: PaginationDto
): Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto,
  });
  return data;
};

export const getLpDetail = async (
  id: string
): Promise<ResponseLpDetailDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};
