export interface IComment {
  user_id: number;
  post_id: number;
  comment: string;
}

export interface ModelComment {
  id: string;
  user_id: number;
  post_id: number;
  comment: string;
  created_at: Date;
}

export interface ICommentWithToken extends IComment {
  token?: string;
}
