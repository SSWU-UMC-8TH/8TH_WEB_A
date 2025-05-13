import { postLike } from "../../apis/lp";
import { useMutation } from "@tanstack/react-query";
import { QUERY_KEY } from "../../constants/key";
import { queryClient } from "../../App";
import { Variable } from "lucide-react";

function usePostLike() {
  return useMutation({
    mutationFn: postLike,
    onSuccess: (data, Variable, context) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, data.data.lpId],
        exact: true,
      });
    },
    onError: (error, variables, context) => {
      console.error("Error liking post:", error);
    },
    onMutate: (variables) => {
      console.log("Mutating like post:", variables);
    },
    onSettled: (data, error, variables, context) => {
      console.log("Like post settled:", { data, error, variables, context });
    },
  })
};

export default usePostLike;