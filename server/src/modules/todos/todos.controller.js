import { todosService } from "./index.js";
import { throwHttpError } from "../../utils/error.js";
import status from "http-status";

export const getTodos = async (req, res) => {
    const todos = await todosService.getTodos();
    return res.json({
        success: true,
        message: "Todos fetched successfully",
        data: todos
    })
}

export const createTodo = async (req, res) => {
    const { title, description } = req.body || {};
    if (!title || !description) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "Title and description are required"
        })
    }
    const todo = await todosService.createTodo(title, description);
    return res.json({
        success: true,
        message: "Todo created successfully",
        data: todo
    })
}

export const getTodoById = async (req, res) => {
    const { id } = req.params || {};
    if (!id) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "ID is required"
        })
    }
    const todo = await todosService.getTodoById(id);
    return res.json({
        success: true,
        message: "Todo fetched successfully",
        data: todo
    })
}

export const updateTodo = async (req, res) => {
    const { id } = req.params || {};
    const { title, description } = req.body || {};
    if (!id || !title || !description) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "ID, title and description are required"
        })
    }
    const todo = await todosService.updateTodo(id, title, description);
    return res.json({
        success: true,
        message: "Todo updated successfully",
        data: todo
    })
}

export const deleteTodo = async (req, res) => {
    const { id } = req.params || {};
    if (!id) {
        return res.status(status.BAD_REQUEST).json({
            success: false,
            message: "ID is required"
        })
    }
    const todo = await todosService.deleteTodo(id);
    return res.json({
        success: true,
        message: "Todo deleted successfully",
        data: todo
    })
}