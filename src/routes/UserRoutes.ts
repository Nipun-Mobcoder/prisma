import express, { RequestHandler } from "express";
import { UserController } from "@src/controller/UserController";
import { UserService } from "@src/service/UserService";
import { UserRepository } from "@src/repositories/UserRepositries";

const router = express.Router();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.route("/register").post(userController.createUser as RequestHandler);
router.route("/login").post(userController.login as RequestHandler);
router.route("/profile").get(userController.profile as RequestHandler);

export default router;
