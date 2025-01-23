import jwt from "jsonwebtoken";
import prisma from "../config/db.config";
import { commentAllDetails, findPost, IPost, ModelPost } from "@src/dto/Post";
import { ModelUser } from "@src/dto/User";

export interface IPostRepository {
  findPost(data: findPost): Promise<ModelPost | null>;
  create(data: IPost): Promise<ModelPost>;
  fetchDetails(token: string): ModelUser;
  fetchPosts(user_id: number): Promise<ModelPost[]>;
  fetchComments(post_id: number): Promise<commentAllDetails[]>;
}

export class PostRepository implements IPostRepository {
  findPost = async (data: findPost): Promise<ModelPost | null> => {
    try {
      let findPost = null;
      const { id, user_id, title } = data;
      if (id) {
        findPost = await prisma.post.findUnique({
          where: {
            id,
          },
        });
      } else if (user_id && title) {
        findPost = await prisma.post.findUnique({
          where: {
            user_id_title: {
              user_id,
              title,
            },
          },
        });
      }

      return findPost;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  create = async (data: IPost): Promise<ModelPost> => {
    try {
      if (data.user_id === null || data.user_id === -1) throw new Error("Token is Invalid");
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
      return jwt.verify(token, process.env.JWT_SECRET || "") as ModelUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  fetchPosts = async (user_id: number): Promise<ModelPost[]> => {
    try {
      const posts = await prisma.post.findMany({
        where: {
          user_id,
        },
      });
      return posts;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  fetchComments = async (post_id: number): Promise<commentAllDetails[]> => {
    return await prisma.comment.findMany({
      where: { post_id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
  };
}
