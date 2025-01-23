import { ICommentWithToken, ModelComment } from "@src/dto/Comments";
import { ICommentRepository } from "@src/repositories/CommentRepositories";

export interface ICommentService {
  createComment(data: ICommentWithToken): Promise<ModelComment>;
  fetchAllComments(token: string): Promise<ModelComment[]>;
  delete(comment_id: string, token: string): Promise<ModelComment>;
}

export class CommentService implements ICommentService {
  private commentRepository: ICommentRepository;

  constructor(commentRepository: ICommentRepository) {
    this.commentRepository = commentRepository;
  }

  createComment = async (data: ICommentWithToken): Promise<ModelComment> => {
    try {
      const { token, comment, post_id } = data;
      if (!token || !comment || !post_id) throw new Error("Data not specific.");
      const userData = this.commentRepository.fetchDetails(token);

      const newData = { ...data, user_id: userData.id };
      delete newData.token;
      const dbData = await this.commentRepository.create(newData);
      await this.commentRepository.changeAmount("increment", post_id);
      return dbData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  fetchAllComments = async (token: string): Promise<ModelComment[]> => {
    try {
      const userData = this.commentRepository.fetchDetails(token);
      const comments = await this.commentRepository.fetchComments(userData.id);
      if (!comments) throw new Error("No comments found.");
      return comments;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  delete = async (comment_id: string, token: string): Promise<ModelComment> => {
    try {
      const userData = this.commentRepository.fetchDetails(token);
      const comment = await this.commentRepository.fetchComment(comment_id);
      if (comment.user_id !== userData.id) throw new Error("You are not authorized to perform this action.");
      const commentDelete = await this.commentRepository.deleteComment(comment_id);
      await this.commentRepository.changeAmount("decrement", comment.post_id);
      return commentDelete;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };
}
