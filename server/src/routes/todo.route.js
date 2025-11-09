import { Router } from "express";
import { todosController } from "../modules/todos/index.js";

const router = Router();

router.get("/", todosController.getTodos);
router.get("/:id", todosController.getTodoById);
router.post("/", todosController.createTodo);
router.put("/:id", todosController.updateTodo);
router.patch("/:id/toggle", todosController.toggleTodoComplete);
router.delete("/:id", todosController.deleteTodo);

export default router;