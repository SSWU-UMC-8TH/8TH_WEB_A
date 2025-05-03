import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key.ts";

console.log("✅ API 주소 확인:", import.meta.env.VITE_SERVER_API_URL);

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_KEY.accessToken)}`,
  },
});