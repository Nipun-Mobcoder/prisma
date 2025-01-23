import jwt from 'jsonwebtoken';
import prisma from "../config/db.config";
import { IPost, ModelPost } from '@src/dto/IPost';
import { ModelUser } from '@src/dto/IUser';

export interface IPostRepository {
    findPost(title: string, user_id: number): Promise<ModelPost | null>;
    create(data: IPost): Promise<ModelPost>;
    fetchDetails(token: string): ModelUser;
    fetchPosts(user_id: number): Promise<ModelPost[]>
}

export class PostRepository implements IPostRepository {
  findPost = async (title: string, user_id: number): Promise<ModelPost | null> => {
    const findPost = await prisma.post.findFirst({
      where: {
        title,
        user_id
      },
    });

    return findPost;
  };

  create = async (data: IPost): Promise<ModelPost> => {
    try {
      if(data.user_id === null || data.user_id === -1) throw new Error("Token is Invalid");
      const newUser = await prisma.post.create({
        data,
      });
      return newUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  fetchDetails = (token: string): ModelUser => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || '') as ModelUser;
    } catch(error) {
        if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
        throw new Error("An unexpected error occurred.");
    }
  };

  fetchPosts = async (user_id: number): Promise<ModelPost[]> => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          user_id
        }
      });
      return posts;
    } catch(error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
        throw new Error("An unexpected error occurred.");
    }
  }
}