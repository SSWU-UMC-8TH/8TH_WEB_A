import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { axiosInstance } from "../../apis/axios"

interface Author {
  id: number;
  name: string;
  email: string;
  bio: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  content: string;
  lpId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  author: Author;
}

interface CommentResponse {
  data: Comment[];
}

const fetchComments = async (lpId: number, order: "asc" | "desc") => {
  const res = await axiosInstance.get(`/v1/lps/${lpId}/comments`, {
    params: { order },
  });

  const comments = res.data?.data?.data;
  return Array.isArray(comments) ? comments : [];
};

export default function useGetComments(lpId: number, order: "asc" | "desc") {
  return useQuery({
    queryKey: ["comments", lpId, order],
    queryFn: () => fetchComments(lpId, order),
  });
}
