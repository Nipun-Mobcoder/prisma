export interface IPost {
    user_id: number, 
    description: string, 
    title: string
  }
  
  export interface ModelPost {
    description: string;
    title: string;
    id: number;
    user_id: number;
    created_at: Date;
  }