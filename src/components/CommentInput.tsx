const CommentInput = () => {
  return (
    <div className="border p-4 rounded-md shadow-sm w-full">
      <textarea
        className="w-full border rounded p-2 resize-none"
        rows={4}
        placeholder="댓글을 입력해주세요"
        disabled
      />
      <button
        className="mt-2 bg-gray-300 text-white px-4 py-2 rounded cursor-not-allowed"
        disabled
      >
        댓글 작성
      </button>
    </div>
  );
};

export default CommentInput;
