import { Request, Response } from "express";
import { IUserService } from "@src/service/UserService";
import { logger } from "@src/utils/logging";

export interface IUserController {
  createUser(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  profile(req: Request, res: Response): Promise<void>;
}

export class UserController implements IUserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    try {
      const userData = await this.userService.createUser({ name, email, password });
      res.status(200).json({
        success: true,
        message: `User ${name} created successfully`,
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

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
      const token = await this.userService.loginUser({
          email, password,
          name: null
      });
      res.status(200).json({
        success: true,
        token,
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

  profile = async (req: Request, res: Response) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith('Bearer ')) {
            res.status(500).json({
                success: false,
                message: "Unauthorized",
            })
            return;
          }
        const profile = await this.userService.profile(authorization.substring(7));
        res.status(200).json({
            success: true,
            profile
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
  }
}