// File: src/apis/authApi.ts
import {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from '../types/authTypes';
import { axiosInstance } from './axios';


interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const postSignup = async (
  body: RequestSignupDto
): Promise<ResponseSignupDto> => {
  console.log('회원가입 요청 바디:', body);
  const resp = await axiosInstance.post<ApiResponse<ResponseSignupDto>>(
    '/v1/auth/signup',
    body
  );
  return resp.data.data;
};

export const postSignin = async (
  body: RequestSigninDto
): Promise<ResponseSigninDto> => {
  console.log('로그인 요청 바디:', body);
  // ApiResponse<{ accessToken: string; refreshToken: string }>
  const resp = await axiosInstance.post<
    ApiResponse<{ accessToken: string; refreshToken: string }>
  >('/v1/auth/signin', body);

  console.log('▶️ 원본 resp.data:', resp.data);

  const { accessToken, refreshToken } = resp.data.data;
  // Context에서 기대하는 키 이름으로 매핑해서 리턴
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

export const getMyInfo = async (): Promise<ResponseMyInfoDto> => {
  // ApiResponse<ResponseMyInfoDto>
  const resp = await axiosInstance.get<ApiResponse<ResponseMyInfoDto>>(
    '/v1/users/me'
  );
  return resp.data.data;
};

// src/apis/authApi.ts
export const postLogout = async (): Promise<void> => {
    await axiosInstance.post(
      '/v1/auth/signout',
      {},                      // 빈 바디
      { withCredentials: true } 
    );
   };
  

   export const deleteUser = async (): Promise<void> => {
    await axiosInstance.delete('/v1/users');
  };
