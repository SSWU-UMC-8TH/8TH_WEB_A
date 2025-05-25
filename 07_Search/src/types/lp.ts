import { CursorBasedResponse } from "./common";

export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
}


export interface LP {
  id: number;
  title: string;
  createdAt: string;
  thumbnail: string;
  likes: any[];
}

export interface ResponseLPListDto {
  data: {
    data: LP[];
    nextCursor: number | null;
    hasNext: boolean;
  };
  status: boolean;
  statusCode: number;
  message: string;
}




export interface LPDetail {
    id: number;
    title: string;
    content: string;
    thumbnail: string;
    published: boolean;
    authorId: number;
    createdAt: string;
    updatedAt: string;
    tags: Tag[];
    likes: Likes[];
    author: {
      id: number;
      name: string;
      email: string;
      bio: string | null;
      avatar: string | null;
      createdAt: string;
      updatedAt: string;
    };
  }
  
  export interface ResponseLPDetailDto {
    data: LPDetail;
  }
  
  

