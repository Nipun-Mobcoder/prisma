import { Request, Response } from "express";
import { logger } from "@src/utils/logging";
import { IPostService } from "@src/service/PostService";

export interface IPostController {
  createPost(req: Request, res: Response): Promise<void>;
  showPost(req: Request, res: Response): Promise<void>;
  showComment(req: Request, res: Response): Promise<void>;
}

export class PostController implements IPostController {
  private postService: IPostService;

  constructor(postService: IPostService) {
    this.postService = postService;
  }

  createPost = async (req: Request, res: Response) => {
    const { description, title } = req.body;
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
      const userData = await this.postService.createPost({
        token: authorization.substring(7),
        description,
        title,
        user_id,
      });
      res.status(200).json({
        success: true,
        message: `Post ${title} created successfully`,
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

  showPost = async (req: Request, res: Response) => {
    try {
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(500).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }
      const post = await this.postService.show(authorization.substring(7));
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

  showComment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { authorization } = req.headers;
      if (!authorization || !authorization.startsWith("Bearer ")) {
        res.status(500).json({
          success: false,
          message: "Unauthorized",
        });
        return;
      }
      const post = await this.postService.showComments(Number(id));
      res.status(200).json({
        success: true,
        ...post,
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
