import { IComment } from "./Comments";

export interface IPost {
  user_id: number;
  description: string;
  title: string;
}

export interface ModelPost {
  description: string;
  title: string;
  id: number;
  user_id: number;
  created_at: Date;
}

export interface IPostWithToken extends IPost {
  token?: string;
}

export interface findPost {
  id?: number;
  user_id?: number;
  title?: string;
}

export interface commentAllDetails extends IComment {
  user: {
    name: string | null;
    email: string;
  };
}
