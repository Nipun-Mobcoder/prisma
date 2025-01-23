import express, { RequestHandler } from "express";
import { CommentRepository } from "@src/repositories/CommentRepositories";
import { CommentService } from "@src/service/CommentService";
import { CommentController } from "@src/controller/CommentController";

const commentRoutes = express.Router();
const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);

commentRoutes.route("/create").post(commentController.createComment as RequestHandler);
commentRoutes.route("/show").get(commentController.showComments as RequestHandler);
commentRoutes.route("/delete").delete(commentController.deleteComments as RequestHandler);

export default commentRoutes;
