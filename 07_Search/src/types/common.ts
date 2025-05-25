
export type CommonResponse<T> = {
    status: boolean;
    statusCode: number;
    message: string;
    data: T;
  };

  export interface CursorBasedResponse<T> {
    data: T & {
      nextCursor: string | null;
      hasNext: boolean;
    };
    status: boolean;
    statusCode: number;
    message: string;
  }

export enum PAGINATION_ORDER{
  "asc" = "asc",
  "desc" = "desc",
}

export type PaginationDto = {
  cursor?: number;
  limit?: number;
  search?: string;
  order?: PAGINATION_ORDER;
};

