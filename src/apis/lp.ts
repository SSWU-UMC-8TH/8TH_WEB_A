import { PaginationDto } from "../types/common";
import { CreateLpDto, GetCommentParams, RequestLpDto, ResponseCommentListDto, ResponseLikeLpDto, ResponseLpDto, ResponseLPListDto } from "../types/lp";
import { axiosInstance } from "./axios";

export const getLpList = async (paginationDto: PaginationDto):Promise<ResponseLPListDto> => {
  const { data } = await axiosInstance.get("/v1/lps", {
    params: paginationDto
  });
  return data;
}; 

export const getLpDetail = async ({lpId}:RequestLpDto):Promise<ResponseLpDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}`);

  return data;
};

export const postLike = async ({ lpId }: RequestLpDto):Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.post(`/v1/lps/${lpId}/likes`);

  return data;
}

export const deleteLike = async ({ lpId }: RequestLpDto):Promise<ResponseLikeLpDto> => {
  const { data } = await axiosInstance.delete(`/v1/lps/${lpId}/likes`);

  return data;
}

export const getComments = async ({
  lpId,
  cursor,
  limit,
  order,
}: GetCommentParams): Promise<ResponseCommentListDto> => {
  const { data } = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { cursor, limit, order },
  });
  return data;
};

export const postLp = async (lpData: CreateLpDto): Promise<void> => {
  const res = await axiosInstance.post("/v1/lps", lpData);
  return res.data;
};

export const uploadImageToServer = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post("/v1/uploads", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data.data.imageUrl;
}