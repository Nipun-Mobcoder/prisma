import express, { RequestHandler } from "express";
import { PostController } from "@src/controller/PostController";
import { PostRepository } from "@src/repositories/PostRepositries";
import { PostService } from "@src/service/PostService";

const postRoutes = express.Router();
const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

postRoutes.route("/create").post(postController.createPost as RequestHandler);
postRoutes.route("/show").get(postController.showPost as RequestHandler);

export default postRoutes;