import { Router } from "express";
import todoRouter from "./todo.route.js";

const router = Router();

router.use("/todos", todoRouter);

export default router;