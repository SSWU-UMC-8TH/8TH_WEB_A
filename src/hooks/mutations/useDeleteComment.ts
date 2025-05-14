import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../apis/axios";

export default function useDeleteComment(lpId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      await axiosInstance.delete(`/v1/lps/${lpId}/comments/${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", lpId] });
    },
  });
}