// src/apis/axios.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from '../utils/localStorage';
import { LOCAL_STORAGE_KEY } from '../constants/key';

interface RetryConfig extends InternalAxiosRequestConfig { _retry?: boolean }
interface ApiResponse<T> { statusCode: number; message: string; data: T }

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL ?? 'http://localhost:8000/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getLocalStorage(LOCAL_STORAGE_KEY.accessToken);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const original = err.config as RetryConfig;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      // 리프레시 자체가 401이면 강제 로그아웃
      if (original.url?.endsWith('/auth/refresh')) {
        removeLocalStorage(LOCAL_STORAGE_KEY.accessToken);
        removeLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        window.location.href = '/login';
        return Promise.reject(err);
      }
      try {
        // raw refreshToken 꺼내서 그대로 body에!
        const refreshToken = getLocalStorage(LOCAL_STORAGE_KEY.refreshToken);
        const { data: { data } } = await axiosInstance.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          '/auth/refresh',
          { refresh_token: refreshToken } 
        );
        const { accessToken, refreshToken: newRefresh } = data;
        setLocalStorage(LOCAL_STORAGE_KEY.accessToken, accessToken);
        setLocalStorage(LOCAL_STORAGE_KEY.refreshToken, newRefresh);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${accessToken}`;
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
