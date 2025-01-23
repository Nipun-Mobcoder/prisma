import { Request, Response } from "express";
import { logger } from "@src/utils/logging";
import { ICommentService } from "@src/service/CommentService";

export interface ICommentController {
  createComment(req: Request, res: Response): Promise<void>;
  showComments(req: Request, res: Response): Promise<void>;
  deleteComments(req: Request, res: Response): Promise<void>;
}

export class CommentController implements ICommentController {
  private commentService: ICommentService;

  constructor(commentService: ICommentService) {
    this.commentService = commentService;
  }

  createComment = async (req: Request, res: Response) => {
    const { comment, post_id } = req.body;
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      res.status(500).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }
    try {
      const user_id = -1;
      const userData = await this.commentService.createComment({
        token: authorization.substring(7),
        comment,
        post_id,
        user_id,
      });
      res.status(200).json({
        success: true,
        message: `Comment created successfully`,
        userData,
      });
    } catch (error) {
      logger.error(error instanceof Error ? error?.message : "Looks like something went wrong.");
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error?.message || "Internal server error",
          error,
        });
      }
    }
  };

  showComments = async (req: Request, res: Response) => {
    try {
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(500).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }
      const post = await this.commentService.fetchAllComments(authorization.substring(7));
      res.status(200).json({
        success: true,
        post,
      });
    } catch (error) {
      logger.error(error instanceof Error ? error?.message : "Looks like something went wrong.");
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error?.message || "Internal server error",
          error,
        });
      }
    }
  };

  deleteComments = async (req: Request, res: Response) => {
    try {
      const { comment_id } = req.body;
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(500).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }
      const post = await this.commentService.delete(comment_id, authorization.substring(7));
      res.status(200).json({
        success: true,
        post,
      });
    } catch (error) {
      logger.error(error instanceof Error ? error?.message : "Looks like something went wrong.");
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: error?.message || "Internal server error",
          error,
        });
      }
    }
  };
}
