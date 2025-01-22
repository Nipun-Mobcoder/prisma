export interface IUser {
  name: string | null;
  email: string;
  password: string;
}

export interface ModelUser {
  email: string;
  password: string;
  id: number;
  name: string | null;
  created_at: Date;
}