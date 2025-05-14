import { useParams } from "react-router-dom";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";

import { Heart } from "lucide-react";
import { MoreVertical, Trash2, Pencil } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import useGetInfiniteCommentList from "../hooks/queries/useGetInfiniteCommentList";
import { PAGINATION_ORDER } from "../enums/common";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import CommentSkeletonList from "../components/\bComment/CommentSkeletonList";

import usePostComment from "../hooks/mutations/usePostComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import useUpdateComment from "../hooks/mutations/useUpdateCommet";
import CommentItem from "../components/\bComment/CommetItem";

const LpDetailPage = () => {
  const [sortOrder, setSortOrder] = useState(PAGINATION_ORDER.desc);
  const { lpId } = useParams();
  const lpIdNumber = Number(lpId);
  const { accessToken } = useAuth();
  const { data: lp, isPending, isError } = useGetLpDetail({ lpId: Number(lpId) });
  const [commentInput, setCommentInput] = useState("");


  const { mutate: deleteComment } = useDeleteComment(lpIdNumber);
const { mutate: updateComment } = useUpdateComment(lpIdNumber);

  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate, mutateAsync } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();
  const { mutate: postCommentMutate, isPending: isPosting } = usePostComment();
  
  const isLiked = lp?.data.likes
    .map((like) => like.userId)
    .includes(me?.data.id as number);
  // const isLiked = lp?.data.likes.some((like) => like.userId === me?.data.id);
  
  const handleLikeLp = () => {
    likeMutate({ lpId: Number(lpId) });
  }

  const handleDisLikeLp = () => {
    dislikeMutate({ lpId: Number(lpId) });
  }

  const {
    data: commentsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetInfiniteCommentList(Number(lpId), 10, sortOrder);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) return <p>댓글 불러오는 중...</p>;

  if (isPending && isError) {
    return (
      <>
        <div className="mt-20 text-white">Loading...</div>
      </>
    );
  }

  const handlePostComment = () => {
    if (!commentInput.trim()) return;

    postCommentMutate(
      {
        lpId: Number(lpId),
        content: commentInput.trim(),
        order: sortOrder,
      },
      {
        onSuccess: () => {
          setCommentInput(""); // 입력창 비우기
          refetch();
        },
        onError: (error: any) => {
          console.error("댓글 작성 에러:", error);
          alert(error?.response?.data?.message || "댓글 작성에 실패했습니다.");
        },
      }
    );
  };


  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-3xl bg-black text-white rounded-2xl shadow-xl p-8">
        {/* LP 정보 */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold mb-2">{lp?.data.title}</h1>
          <img
            className="w-full max-h-80 object-cover rounded-xl mb-4"
            src={lp?.data.thumbnail}
            alt={lp?.data.title}
          />
          <p className="mb-4 text-gray-300">{lp?.data.content}</p>
          <button onClick={isLiked ? handleDisLikeLp : handleLikeLp}>
            <Heart
              size={28}
              color={isLiked ? "red" : "white"}
              fill={isLiked ? "red" : "transparent"}
            />
          </button>
        </div>

        {/* 댓글 작성란 */}
        <h2 className="text-xl font-bold mb-1">댓글</h2>
        <div className="mb-2 flex items-start gap-2">
          <textarea
            className="flex-1 p-2 h-10 text-sm text-white rounded-md border border-gray-300 focus:outline-none placeholder-gray-400 resize-none "
            placeholder="댓글을 작성해주세요..."
            rows={1}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            onClick={handlePostComment}
            disabled={isPosting}
            className="px-4 h-10 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 text-sm">
            작성
          </button>
        </div>

        <div>
          {/* 정렬 버튼 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setSortOrder(PAGINATION_ORDER.desc)}
              className={`px-3 py-1 rounded-md border ${sortOrder === PAGINATION_ORDER.desc
                ? "bg-white text-black font-semibold"
                : "bg-transparent border-white text-white"
                }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortOrder(PAGINATION_ORDER.asc)}
              className={`px-3 py-1 rounded-md border ${sortOrder === PAGINATION_ORDER.asc
                ? "bg-white text-black font-semibold"
                : "bg-transparent border-white text-white"
                }`}
            >
              오래된 순
            </button>
          </div>

          {/* 댓글 리스트 */}
          <div>
            {isLoading ? (
              <CommentSkeletonList count={5} />
            ) : (
              commentsData?.pages.map((page, pageIndex) =>
                page.data.data.map((comment, idx) => (
                  <CommentItem
                    key={`${pageIndex}-${idx}`}
                    comment={comment}
                    lpId={lpIdNumber}
                    myId={me?.data.id}
                    refetch={refetch}
                  />
                ))
              )

            )}
            <div ref={ref} style={{ height: "20px" }} />

          </div>
        </div>
      </div>
    </div>

  );
};

export default LpDetailPage;
