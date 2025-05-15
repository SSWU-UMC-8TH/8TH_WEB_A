import { useMutation } from "@tanstack/react-query";
import { deleteLp } from "../../apis/lp";
import { queryClient } from "../../App";
import { RequestLpDto } from "../../types/lp";

const useDeleteLp = () => {
  return useMutation({
    mutationFn: (lpId: RequestLpDto) => deleteLp(lpId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lps"] });
      alert("LP가 삭제되었습니다.");
    },
    onError: (err) => {
      console.error("LP 삭제 실패:", err);
      alert("삭제 실패");
    },
  });
};

export default useDeleteLp;
