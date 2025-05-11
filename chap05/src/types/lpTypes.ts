// src/types/lpTypes.ts
export type Tag = {
  id: number;
  name: string;
};

export type Likes = {
  id: number;
  userId: number;
  lpId: number;
};

export type Lp = {
  [x: string]: any;
  data: any;
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
    name: string;
    profileUrl: string;
  };
};

export type ResponseLPListDto = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Lp;
  nextCursor: number;
  hasNext: boolean;
};


export type ResponseLpDetailDto = {
  status: boolean;
  statusCode: number;
  message: string;
  data: Lp;
};
