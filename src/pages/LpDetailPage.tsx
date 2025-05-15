import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Heart } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import useGetLpDetail from "../hooks/queries/useGetLpDetail";
import useGetMyInfo from "../hooks/queries/useGetMyInfo";
import usePostLike from "../hooks/mutations/usePostLike";
import useDeleteLike from "../hooks/mutations/useDeleteLike";
import usePostComment from "../hooks/mutations/usePostComment";
import useUpdateLp from "../hooks/mutations/useUpdateLp";
import useDeleteLp from "../hooks/mutations/useDeleteLp";
import useGetInfiniteCommentList from "../hooks/queries/useGetInfiniteCommentList";


import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeletonList from "../components/\bComment/CommentSkeletonList";
import CommentItem from "../components/\bComment/CommetItem";
import { ThumbnailInput } from "../components/ThumbnailInput";

const LpDetailPage = () => {
  const { lpId } = useParams();
  const lpIdNumber = Number(lpId);
  const { accessToken } = useAuth();

  const [sortOrder, setSortOrder] = useState(PAGINATION_ORDER.desc);
  const [commentInput, setCommentInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedThumbnail, setEditedThumbnail] = useState("");

  const { data: lp, isPending, isError } = useGetLpDetail({ lpId: lpIdNumber });
  const { data: me } = useGetMyInfo(accessToken);
  const { mutate: likeMutate } = usePostLike();
  const { mutate: dislikeMutate } = useDeleteLike();
  const { mutate: postCommentMutate, isPending: isPosting } = usePostComment();
  const { mutate: updateLpMutate } = useUpdateLp();
  const { mutate: deleteLpMutate } = useDeleteLp();

  const {
    data: commentsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useGetInfiniteCommentList(lpIdNumber, 10, sortOrder);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (lp?.data) {
      setEditedTitle(lp.data.title);
      setEditedContent(lp.data.content);
      setEditedThumbnail(lp.data.thumbnail);
    }
  }, [lp]);

  if (isPending) return <p className="mt-20 text-white">Loading...</p>;
  if (isError) return <p className="mt-20 text-red-500">오류가 발생했습니다.</p>;

  const isMine = me?.data.id === lp?.data.id;

  const isLiked = lp?.data.likes.some((like) => like.userId === me?.data.id);

  const handleLikeLp = () => likeMutate({ lpId: lpIdNumber });
  const handleDisLikeLp = () => dislikeMutate({ lpId: lpIdNumber });

  const handlePostComment = () => {
    if (!commentInput.trim()) return;

    postCommentMutate(
      {
        lpId: lpIdNumber,
        content: commentInput.trim(),
        order: sortOrder,
      },
      {
        onSuccess: () => {
          setCommentInput("");
          refetch();
        },
        onError: (error: any) => {
          alert(error?.response?.data?.message || "댓글 작성에 실패했습니다.");
        },
      }
    );
  };

  const handleUpdateLp = () => {
    updateLpMutate({
      lpId: lpIdNumber,
      patchData: {
        title: editedTitle,
        content: editedContent,
        thumbnail: editedThumbnail,
      },
    });
    setIsEditing(false);
  };

  const handleDeleteLp = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteLpMutate({ lpId: lpIdNumber });
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 py-10 px-4">
      <div className="w-full max-w-3xl bg-black text-white rounded-2xl shadow-xl p-8">
        {/* LP Info */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <img
                src={me?.data.avatar || "/default-profile.png"}
                alt="프로필"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-sm text-gray-300">{me?.data.name}</span>
            </div>
            
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button onClick={handleUpdateLp} className="px-3 py-1 bg-white text-black text-sm rounded-md">저장</button>
                    <button onClick={() => setIsEditing(false)} className="px-3 py-1 bg-gray-700 text-white text-sm rounded-md">취소</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setIsEditing(true)} className="px-3 py-1 bg-white text-black text-sm rounded-md">수정</button>
                    <button onClick={handleDeleteLp} className="px-3 py-1 bg-red-500 text-white text-sm rounded-md">삭제</button>
                  </>
                )}
              </div>
            
          </div>

          {isEditing ? (
            <>
              <input
                className="text-2xl font-bold mb-2 w-full bg-transparent border-b border-gray-400 outline-none text-white"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <ThumbnailInput thumbnail={editedThumbnail} setThumbnail={setEditedThumbnail} />
              <textarea
                className="w-full bg-transparent border border-gray-400 rounded-md p-2 text-white"
                rows={5}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-2">{lp?.data.title}</h1>
              <img
                className="w-full max-h-80 object-cover rounded-xl mb-4"
                src={lp?.data.thumbnail}
                alt={lp?.data.title}
              />
              <p className="mb-4 text-gray-300 whitespace-pre-wrap">{lp?.data.content}</p>
            </>
          )}
          <button onClick={isLiked ? handleDisLikeLp : handleLikeLp}>
            <Heart
              size={28}
              color={isLiked ? "red" : "white"}
              fill={isLiked ? "red" : "transparent"}
            />
          </button>
        </div>

        {/* 댓글 입력 */}
        <h2 className="text-xl font-bold mb-1">댓글</h2>
        <div className="mb-2 flex items-start gap-2">
          <textarea
            className="flex-1 p-2 h-10 text-sm text-white rounded-md border border-gray-300 placeholder-gray-400 resize-none"
            placeholder="댓글을 작성해주세요..."
            rows={1}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
          <button
            onClick={handlePostComment}
            disabled={isPosting}
            className="px-4 h-10 bg-white text-black rounded-md border border-gray-300 hover:bg-gray-100 text-sm"
          >
            작성
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSortOrder(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded-md border ${sortOrder === PAGINATION_ORDER.desc ? "bg-white text-black font-semibold" : "bg-transparent border-white text-white"}`}
          >
            최신순
          </button>
          <button
            onClick={() => setSortOrder(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded-md border ${sortOrder === PAGINATION_ORDER.asc ? "bg-white text-black font-semibold" : "bg-transparent border-white text-white"}`}
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
  );
};

export default LpDetailPage;
