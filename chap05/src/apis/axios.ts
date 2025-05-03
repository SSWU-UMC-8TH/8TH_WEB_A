import axios, { AxiosInstance } from 'axios';
import { LOCAL_STORAGE_KEY } from '../constants/key';
import { getLocalStorage } from '../utils/localStorage';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json', 
    Accept: 'application/json',        
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    let token: string | null = null;

    try {
      token = getLocalStorage(LOCAL_STORAGE_KEY.accessToken);
    } catch (e) {
      console.error(`❌ 로컬스토리지에서 accessToken 불러오기 실패:`, e);
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('[요청 URL]', `${config.baseURL ?? ''}${config.url ?? ''}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ 응답 인터셉터: 에러 콘솔 출력
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
