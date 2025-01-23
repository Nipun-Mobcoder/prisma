import { commentAllDetails, IPostWithToken, ModelPost } from "@src/dto/Post";
import { IPostRepository } from "@src/repositories/PostRepositries";

export interface IPostService {
  createPost(data: IPostWithToken): Promise<ModelPost>;
  show(token: string): Promise<ModelPost[]>;
  showComments(post_id: number): Promise<{ post: ModelPost; commentsWithUserDetails: commentAllDetails[] }>;
}

export class PostService implements IPostService {
  private postRepository: IPostRepository;

  constructor(postRepository: IPostRepository) {
    this.postRepository = postRepository;
  }

  createPost = async (data: IPostWithToken): Promise<ModelPost> => {
    try {
      const { token, title } = data;
      if (!token || !title) throw new Error("Data not specific.");
      const userData = this.postRepository.fetchDetails(token);
      const ifPostExist = await this.postRepository.findPost({ title, user_id: userData.id });
      if (ifPostExist) {
        throw new Error(`${title} already exists for user ${userData.id}`);
      }

      const newData = { ...data, user_id: userData.id };
      delete newData.token;
      const dbData = await this.postRepository.create(newData);
      return dbData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  show = async (token: string): Promise<ModelPost[]> => {
    try {
      const userData = this.postRepository.fetchDetails(token);
      const userDetails = await this.postRepository.fetchPosts(userData.id);
      if (!userDetails) throw new Error("User not found.");
      return userDetails;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };

  showComments = async (
    post_id: number,
  ): Promise<{ post: ModelPost; commentsWithUserDetails: commentAllDetails[] }> => {
    try {
      const post = await this.postRepository.findPost({
        id: post_id,
      });
      if (!post) throw new Error("Post not found.");
      const commentsWithUserDetails = await this.postRepository.fetchComments(post_id);
      return { post, commentsWithUserDetails };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error?.message || "Looks like something went wrong.");
      }
      throw new Error("An unexpected error occurred.");
    }
  };
}
