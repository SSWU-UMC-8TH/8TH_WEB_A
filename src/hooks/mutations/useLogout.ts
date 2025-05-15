import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

export const useLogout = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => logout(), 
    onSuccess: () => {
      window.location.href = "/"; 
    },
    onError: (error) => {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 문제가 발생했습니다.");
    },
  });
};