import { IUser, ModelUser } from "@src/dto/User";
import { IUserRepository } from "@src/repositories/UserRepositries";
import bcrypt from "bcryptjs";

export interface IUserService {
  createUser(data: IUser): Promise<ModelUser>;
  loginUser(data: IUser): Promise<string>;
  profile(token: string): Promise<ModelUser>;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;
  private bcryptSalt: string;

  constructor(userRepository: IUserRepository) {
    this.bcryptSalt = bcrypt.genSaltSync(10);
    this.userRepository = userRepository;
  }

  createUser = async (data: IUser): Promise<ModelUser> => {
    try {
      const { email, password } = data;
      const ifUserExist = await this.userRepository.findUser(email);
      if (ifUserExist) {
        throw new Error(`${email} already exists`);
      }

      const hashPassword = bcrypt.hashSync(password, this.bcryptSalt);
      const dbData = await this.userRepository.create({ ...data, password: hashPassword });
      return dbData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  loginUser = async (data: IUser): Promise<string> => {
    try {
      const user = await this.userRepository.findUser(data.email);
      if (!user || !bcrypt.compareSync(data.password, user.password)) {
        throw new Error("Given details are incorrect");
      }
      return this.userRepository.createToken(user);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  profile = async (token: string): Promise<ModelUser> => {
    try {
      const data = this.userRepository.fetchDetails(token);
      const userDetails = await this.userRepository.findUser(data.email);
      if (!userDetails) throw new Error("User not found.");
      return userDetails;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };
}
