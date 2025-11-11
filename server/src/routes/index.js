import { Router } from "express";
import todoRouter from "./todo.route.js";
import authRouter from "../modules/auth/auth.route.js";

const router = Router();

router.use("/auth", authRouter);
router.use("/todos", todoRouter);

export default router;