// src/apis/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from '../utils/localStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL ?? 'http://localhost:8000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ✅ 요청 시 accessToken을 Authorization 헤더에 추가
axiosInstance.interceptors.request.use((config) => {
  const token = getLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ 응답 에러 시 자동으로 refresh 토큰으로 재시도
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as RetryConfig;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      // refresh 요청 자체가 실패하면 강제 로그아웃
      if (original.url?.endsWith('/auth/refresh')) {
        removeLocalStorage(LOCAL_STORAGE_KEY.accessToken);
        removeLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = '/login';
        return Promise.reject(err);
      }

      try {
        const refreshToken = getLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

        // ✅ refresh_token을 Authorization 헤더로 보냄
        const { data: { data } } = await axiosInstance.post<
          ApiResponse<{ accessToken: string; refreshToken: string }>
        >('/auth/refresh', {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });

        const { accessToken, refreshToken: newRefresh } = data;

        // ✅ 새로운 토큰 저장
        setLocalStorage(LOCAL_STORAGE_KEY.accessToken, accessToken);
        setLocalStorage(LOCAL_STORAGE_KEY.refreshToken, newRefresh);

        // ✅ 다음 요청에 새 accessToken 사용
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${accessToken}`;

        // ✅ 원래 요청 다시 시도
        return axiosInstance(original);
      } catch (refreshErr) {
        removeLocalStorage(LOCAL_STORAGE_KEY.accessToken);
        removeLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);
