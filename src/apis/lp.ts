import { PaginationDto } from "../types/common";
import { ResponseLPListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto):Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto
  });
  return data;
}; 

export const getLpDetail = async (id: string):Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${id}`);
  return data;
};


