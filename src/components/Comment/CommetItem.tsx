import { useState } from "react";
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import useDeleteComment from "../../hooks/mutations/useDeleteComment";
import useUpdateComment from "../../hooks/mutations/useUpdateCommet";

interface CommentItemProps {
  comment: {
    id: number;
    content: string;
    author: {
      id: number;
      name: string;
    };
  };
  lpId: number;
  myId: number | undefined;
  refetch: () => void;
}

const CommentItem = ({ comment, lpId, myId, refetch }: CommentItemProps) => {
  const isMine = comment.author.id === myId;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  const { mutate: deleteComment } = useDeleteComment(lpId);
  const { mutate: updateComment } = useUpdateComment(lpId);

  const handleUpdate = () => {
    if (!editedContent.trim()) return;
    updateComment(
      {
        commentId: comment.id,
        content: editedContent.trim(),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetch();
        },
      }
    );
  };

  const handleDelete = () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    deleteComment(comment.id, {
      onSuccess: () => refetch(),
    });
  };

  return (
    <div className="mb-6 border-b border-gray-700 pb-4 relative">
      {/* 메뉴 버튼 */}
      {isMine && !isEditing && (
        <div className="absolute right-0 top-0">
          <button onClick={() => setIsMenuOpen((prev) => !prev)}>
            <MoreVertical size={20} />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-1 w-24 bg-white text-black border rounded-md shadow-md z-10">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-1 w-full px-3 py-2 hover:bg-gray-100"
              >
                <Pencil size={16} /> 수정
              </button>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleDelete();
                }}
                className="flex items-center gap-1 w-full px-3 py-2 hover:bg-gray-100 text-red-600"
              >
                <Trash2 size={16} /> 삭제
              </button>
            </div>
          )}
        </div>
      )}

      {isEditing ? (
        <div>
          <textarea
            className="w-full p-2 text-sm text-white rounded-md border border-gray-300 bg-transparent"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleUpdate}
              className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-1 rounded-md"
            >
              저장
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
              }}
              className="border border-gray-300 hover:bg-gray-100 text-white px-4 py-1 rounded-md ml-2"
            >
              취소
            </button>

          </div>
        </div>
      ) : (
        <>
          <p className="font-semibold">{comment.author.name}</p>
          <p className="text-gray-300">{comment.content}</p>
        </>
      )}
    </div>
  );
};

export default CommentItem;