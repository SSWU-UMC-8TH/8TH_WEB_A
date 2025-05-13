// File: src/components/CommentSection.tsx
import { useState, useEffect } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { axiosInstance } from '../../apis/axios';

interface Comment {
  id: number;
  content: string;
  lpId: number;
  createdAt: string;
  author: {
    id: number;
    name: string;
    avatar: string | null;
  };
}

interface PaginatedResponse {
  data: Comment[];
  nextCursor: number | null;
  hasNext: boolean;
}

interface Props {
  lpId: string;
  currentUserId: number;
}

export const CommentSection = ({ lpId, currentUserId }: Props) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const queryClient = useQueryClient();
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['comments', lpId, order],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await axiosInstance.get<{
        data: PaginatedResponse;
      }>(`/v1/lps/${lpId}/comments`, {
        params: {
          cursor: pageParam,
          limit: 10,
          order,
        },
      });
      return res.data.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: 0,
  });

  const commentMutation = useMutation({
    mutationFn: async (newContent: string) => {
      return await axiosInstance.post(`/v1/lps/${lpId}/comments`, { content: newContent });
    },
    onSuccess: () => {
      setContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', lpId, order] });
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (id: number) => {
      return await axiosInstance.delete(`/v1/lps/${lpId}/comments/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', lpId, order] });
    },
  });

  const editCommentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      return await axiosInstance.patch(`/v1/lps/${lpId}/comments/${id}`, { content });
    },
    onSuccess: () => {
      setEditId(null);
      setEditContent('');
      queryClient.invalidateQueries({ queryKey: ['comments', lpId, order] });
    },
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const comments = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="max-w-3xl w-full bg-gray-800 p-4 rounded-xl text-white mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">댓글</h2>
        <div className="space-x-2">
          <button
            onClick={() => setOrder('asc')}
            className={`px-3 py-1 rounded ${order === 'asc' ? 'bg-white text-black' : 'bg-gray-700'}`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder('desc')}
            className={`px-3 py-1 rounded ${order === 'desc' ? 'bg-white text-black' : 'bg-gray-700'}`}
          >
            최신순
          </button>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력해주세요"
          className="w-full px-3 py-2 rounded bg-gray-700 text-white"
        />
        <button
          onClick={() => commentMutation.mutate(content)}
          disabled={!content.trim() || commentMutation.status === 'pending'}
          className="mt-2 px-4 py-1 bg-blue-600 text-sm rounded disabled:bg-gray-500"
        >
          작성
        </button>
      </div>

      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex gap-3 items-start">
            <img
              src={comment.author.avatar ?? '/default-profile.png'}
              className="w-8 h-8 rounded-full"
              alt="프로필"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-semibold">{comment.author.name}</p>
                {comment.author.id === currentUserId && (
                  <div className="relative">
                    <button onClick={() => setEditId(editId === comment.id ? null : comment.id)}>⋯</button>
                    {editId === comment.id && (
                      <div className="absolute right-0 mt-2 bg-gray-700 rounded shadow-md z-10 text-sm">
                        <button
                          onClick={() => setEditContent(comment.content)}
                          className="block w-full px-4 py-1 hover:bg-gray-600"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => deleteCommentMutation.mutate(comment.id)}
                          className="block w-full px-4 py-1 hover:bg-red-600 text-red-200"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {editId === comment.id ? (
                <div className="mt-2">
                  <input
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-1 rounded bg-gray-600 text-white"
                  />
                  <div className="flex justify-end gap-2 mt-1">
                    <button onClick={() => setEditId(null)} className="text-sm text-gray-300">
                      취소
                    </button>
                    <button
                      onClick={() => editCommentMutation.mutate({ id: comment.id, content: editContent })}
                      className="text-sm text-blue-400 hover:text-blue-200"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-gray-200">{comment.content}</p>
              )}
            </div>
          </li>
        ))}
        {(isLoading || isFetchingNextPage) &&
          Array.from({ length: 5 }).map((_, i) => (
            <li key={i}>
              <Skeleton height={20} count={2} className="mb-2" baseColor="#2e2e2e" highlightColor="#3c3c3c" />
            </li>
          ))}
      </ul>

      <div ref={ref} className="h-1" />
    </div>
  );
};

export default CommentSection;