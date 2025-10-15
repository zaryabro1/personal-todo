import { Router } from "express";
import { todosController } from "../modules/todos/index.js";

const router = Router();

router.get("/", todosController.getTodos);
router.post("/", todosController.createTodo);

export default router;