import { useMutation } from "@tanstack/react-query";
import { patchUser } from "../../apis/lp";
import { queryClient } from "../../App";
import { QUERY_KEY } from "../../constants/key";

function useUpdateUserInfo() {
  return useMutation({
    mutationFn: patchUser,

    onMutate: async (updateData) => {
      // FormData인 경우 optimistic update 불가 → 무시
      if (updateData instanceof FormData) return;

      // nickname만 변경하는 경우에만 낙관적 업데이트 적용
      const { name, bio, avatar } = updateData;

      const isOnlyNickname = name && !bio && !avatar;
      if (!isOnlyNickname) return;

      await queryClient.cancelQueries({ queryKey: [QUERY_KEY.myInfo] });

      const previousUser = queryClient.getQueryData([QUERY_KEY.myInfo]);

      queryClient.setQueryData([QUERY_KEY.myInfo], (old: any) => ({
        ...old,
        name,
      }));

      return { previousUser };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData([QUERY_KEY.myInfo], context.previousUser);
      }
    },
    
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.myInfo],
        exact: true,
      })
    }
  })
}

export default useUpdateUserInfo;