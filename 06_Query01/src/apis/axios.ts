import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  withCredentials: true,
});
 
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("⚠️ accessToken 없음 - Authorization 헤더 미설정");
    }

    return config;
  },
  (error) => Promise.reject(error)
);
