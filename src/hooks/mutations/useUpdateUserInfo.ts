import { useMutation } from "@tanstack/react-query";
import { patchUser } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateUserInfo() {
  return useMutation({
    mutationFn: patchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
        exact: true,
      })
    }
  })
}

export default useUpdateUserInfo;