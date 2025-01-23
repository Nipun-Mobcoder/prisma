import jwt from "jsonwebtoken";
import { IUser, ModelUser } from "@src/dto/User";
import prisma from "../config/db.config";

export interface IUserRepository {
  findUser(email: string): Promise<ModelUser | null>;
  create(data: IUser): Promise<ModelUser>;
  createToken(data: ModelUser): string;
  fetchDetails(token: string): ModelUser;
}

export class UserRepository implements IUserRepository {
  findUser = async (email: string): Promise<ModelUser | null> => {
    try {
      const findUser = await prisma.user.findUnique({
        where: {
          email,
        },
        include: {
          post: true,
        },
      });

      const countPost = await prisma.user.findMany({
        where: {
          email,
        },
        select: {
          _count: {
            select: {
              post: true,
              comment: true,
            },
          },
        },
      });
      console.log(countPost);
      return findUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  create = async (data: IUser): Promise<ModelUser> => {
    try {
      const newUser = await prisma.user.create({
        data,
      });
      return newUser;
    } catch (error) {
      if (error instanceof Error) throw new Error(error?.message || "Looks like something went wrong.");
      throw new Error("An unexpected error occurred.");
    }
  };

  createToken = (user: ModelUser): string => {
    try {
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "", { expiresIn: "1h" });

      return token;
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
}
