import axios, { InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/tokenStorage";

interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string> | null = null;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getAccessToken();
    //console.log("🧪 요청 인터셉터 accessToken:", accessToken);

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
      //console.log("✅ Authorization 헤더 설정됨:", config.headers.Authorization);
    } else {
      console.warn("⚠️ accessToken 없음 - 헤더 미설정");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: CustomInternalAxiosRequestConfig = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      if (originalRequest.url === "/v1/auth/refresh") {
        tokenStorage.removeAccessToken();
        tokenStorage.removeRefreshToken();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = (async () => {
          const refreshToken = tokenStorage.getRefreshToken();

          if (!refreshToken) {
            throw new Error("리프레시 토큰 없음");
          }

          const { data } = await axiosInstance.post("/v1/auth/refresh", {
            refresh: refreshToken,
          });

          console.log("✅ refreshToken 재발급 완료:", data.data.accessToken);

          tokenStorage.setAccessToken(data.data.accessToken);
          tokenStorage.setRefreshToken(data.data.refreshToken);

          return data.data.accessToken;
        })().catch(() => {
          tokenStorage.removeAccessToken();
          tokenStorage.removeRefreshToken();
        }).finally(() => {
          refreshPromise = null;
        });
      }

      return refreshPromise.then((newAccessToken) => {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance.request(originalRequest);
      });
    }

    return Promise.reject(error);
  }
);
