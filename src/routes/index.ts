import express from "express";
import userRoutes from "./UserRoutes";

const router = express.Router();

router.use("/", userRoutes);

export default router;
