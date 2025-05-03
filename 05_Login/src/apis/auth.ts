import { RequestSigninDto, RequestSignupDto, ResponseMyInfoDto, ResponseSigninDto, ResponseSignupDto } from "./../types/auth";
import { axiosInstance } from "./axios";
import axios from "axios";

export const postSignup = async (body: RequestSignupDto):Promise<ResponseSignupDto> => {
  const { data } = await axiosInstance.post("/v1/auth/signup",body);
  return data;
};

export const postSignin = async (body: RequestSigninDto): Promise<ResponseSigninDto> => {
  const { data } = await axios.post(`${import.meta.env.VITE_SERVER_API_URL}/v1/auth/signin`, body, {
    withCredentials: true, 
  });
  return data;
};
export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  const { data } = await axiosInstance.get("/v1/users/me");
  return data;
}