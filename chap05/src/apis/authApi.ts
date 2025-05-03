// File: src/apis/authApi.ts
import {
  RequestSigninDto,
  RequestSignupDto,
  ResponseMyInfoDto,
  ResponseSigninDto,
  ResponseSignupDto,
} from '../types/authTypes';
import { axiosInstance } from './axios';

export async function postSignup(
  body: {
    email: string;
    password: string;
    name: string;
    bio?: string;
    avatar?: string;
  }  
): Promise<ResponseSignupDto> {
  console.log("회원가입 요청 바디:", body);
  const { data } = await axiosInstance.post('/v1/auth/signup', body);
  return data;
}

export async function postSignin(
  body: RequestSigninDto
): Promise<ResponseSigninDto> {
  console.log("로그인 요청 바디:", body);
  const { data } = await axiosInstance.post('/v1/auth/signin', body);
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  };
}

export async function getMyInfo(): Promise<ResponseMyInfoDto> {
  const { data } = await axiosInstance.get('/v1/users/me');
  return data;
}

export async function postLogout(): Promise<void> {
  await axiosInstance.post('/v1/auth/signout');
}
