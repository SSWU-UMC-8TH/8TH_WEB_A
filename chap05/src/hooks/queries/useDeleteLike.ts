import { useMutation } from "@tanstack/react-query";
import { deleteLike } from "../../api/Post/lp";
import { queryClient } from "../../main";
import { QUERY_KEY } from "../../constants/key";
import { Likes, ResponseLpDetailDto } from "../../types/lp";
import { ResponseMyInfoDto } from "../../types/auth";

export function useDeleteLike() {
  return useMutation({
    mutationFn: deleteLike,
    // onMutate -> API 요청 이전에 호출되는 친구.
    // UI에 바로 변경을 보여주기 위해 Cache djqepdlxm
    onMutate: async (lp) => {
      // 1. 이 게시글에 관련된 쿼리를 취소 (캐시된 데이터를 새로 불러오는 요청)
      await queryClient.cancelQueries({
        queryKey: [QUERY_KEY.lps, lp.lpId],
      });

      // 2. 현재 게시글의 데이터를 캐시에서 가져와야한다.
      const previousLpPost = queryClient.getQueryData<ResponseLpDetailDto>([
        QUERY_KEY.lps,
        lp.lpId,
      ]);
      // 롤백용 Data로 설정

      // 3. 게시글 데이터를 복사해서 NewLpPost 라는 새로운 객체를 만들고
      // 복사하는 가장 큰 이유는 나중에 오류가 발생했을 때 이전 상태로 되돌리기 위해서다라고 생각하면 된다.

      // const newLpPost = { ...previousLpPost }; => 강의에서는 한 줄로 해결

      if (!previousLpPost) return {}; // undefined 방지

      // deep copy 해서 완전 분리
      const newLpPost: ResponseLpDetailDto = {
        ...previousLpPost,
        data: {
          ...previousLpPost.data,
          likes: [...previousLpPost.data.likes],
        },
      };

      // 4. 게시글에 저장된 좋아요 목록에서 현재 내가 눌렀던 좋아요의 위치를 찾아야합니다.
      const me = queryClient.getQueryData<ResponseMyInfoDto>([QUERY_KEY.my]);
      const userId = Number(me?.data.id);

      // 강의 영상에서는 newLpPost 부분이 전부 previousLpPost로 대체 **
      const likedIndex =
        newLpPost?.data.likes.findIndex((like) => like.userId === userId) ?? -1;

      if (likedIndex >= 0) {
        newLpPost?.data.likes.splice(likedIndex, 1);
      } else {
        const newLike = { userId, lpId: lp.lpId } as Likes;
        newLpPost?.data.likes.push(newLike);
      }

      // 업데이트된 게시글 데이터를 캐시에 저장
      // 이렇게하면 UI가 바로 업데이트 됨, 사용자가 변화를 확인할 수 있다.
      queryClient.setQueryData([QUERY_KEY.lps, lp.lpId], newLpPost);

      return { previousLpPost, newLpPost };
    },

    onError: (error, newLp, context) => {
      console.log(error, newLp);
      queryClient.setQueryData(
        [QUERY_KEY.lps, newLp.lpId],
        // 강의에선 context?.previousLpPost?.data.id,
        context?.previousLpPost // 전체 객체로 복원해야하지 않나? 왜 Id만 넘겨주는가 ?
      );
    },

    onSettled: async (data, error, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.lps, variables.lpId],
        exact: true,
      });
    },
  });
}

// 질문
// 1. const newLpPost = { ...previousLpPost };
// 같은 배열을 참조하는 얕은 복사이기 때문에 previousLpPost 에서 splice 혹은 push 를 하면 newLpPost 자체도 변동이 되어 const newLpPost = { ...previousLpPost }; 가 의미가 없어지는 것 아닌지 ?
// 때문에 Deep Copy를 통해 newLpPost를 만들고 그 newLpPost 를 통해 변동하고 반영해야 하는 게 아닌가 궁금합니다.

// 2. onError 부분에서 context?.previousLpPost 로 전달해야 데이터 전체가 들어갈텐데, 영상에서는 context?.previousLpPost?.data.id 로 전달하고 있어서
// 롤백에 있어서 id만 전달해주고 있어 문제가 발생하는 것이 아닌 지, 궁금합니다.
