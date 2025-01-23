import jwt from "jsonwebtoken";
import prisma from "../config/db.config";
import { ModelUser } from "@src/dto/User";
import { IComment, ModelComment } from "@src/dto/Comments";
import { logger } from "@src/utils/logging";

export interface ICommentRepository {
  create(data: IComment): Promise<ModelComment>;
  fetchDetails(token: string): ModelUser;
  fetchComment(comment_id: string): Promise<ModelComment>;
  fetchComments(user_id: number): Promise<ModelComment[]>;
  deleteComment(comment_id: string): Promise<ModelComment>;
  changeAmount(status: "increment" | "decrement", post_id: number): Promise<number>;
}

export class CommentRepository implements ICommentRepository {
  create = async (data: IComment): Promise<ModelComment> => {
    try {
      if (data.user_id === null || data.user_id === -1) throw new Error("Token is Invalid");
      const newUser = await prisma.comment.create({
        data,
      });
      return newUser;
    } catch (error) {
      logger.error(error instanceof Error ? error?.message : "Looks like something went wrong.");
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

  fetchComment = async (comment_id: string): Promise<ModelComment> => {
    try {
      const comment = await prisma.comment.findUnique({
        where: {
          id: comment_id,
        },
      });
      if (!comment) throw new Error("This comment doesn't exists.");
      return comment;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  fetchComments = async (user_id: number): Promise<ModelComment[]> => {
    try {
      const comments = await prisma.comment.findMany({
        where: {
          user_id,
        },
      });
      return comments;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  changeAmount = async (status: "increment" | "decrement", post_id: number): Promise<number> => {
    try {
      if (post_id === null) throw new Error("Post is unavailable.");

      const data = status === "increment" ? { comment_count: { increment: 1 } } : { comment_count: { decrement: 1 } };
      const post = await prisma.post.update({
        where: {
          id: post_id,
        },
        data,
      });
      return post.comment_count;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  deleteComment = async (comment_id: string): Promise<ModelComment> => {
    try {
      if (comment_id === null) throw new Error("Token is Invalid");
      const deletedComment = await prisma.comment.delete({
        where: {
          id: comment_id,
        },
      });
      return deletedComment;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };
}
