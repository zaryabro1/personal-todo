import { todosService } from "./index.js";
import { throwHttpError } from "../../utils/error.js";
import status from "http-status";

// Helper to extract userId from request (from auth middleware)
const getUserId = (req) => {
    return req.userId; // Set by auth middleware
}

export const getTodos = async (req, res) => {
    try {
        const userId = getUserId(req);
        const todos = await todosService.getTodos(userId);
        return res.json({
            success: true,
            message: "Todos fetched successfully",
            data: todos
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching todos",
            error: error.message
        });
    }
}

export const createTodo = async (req, res) => {
    try {
        const userId = getUserId(req);
        const { title, description } = req.body || {};
        
        if (!title) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Title is required"
            });
        }
        
        const todo = await todosService.createTodo(userId, title, description || "");
        return res.status(status.CREATED).json({
            success: true,
            message: "Todo created successfully",
            data: todo
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error creating todo",
            error: error.message
        });
    }
}

export const getTodoById = async (req, res) => {
    try {
        const { id } = req.params || {};
        const userId = getUserId(req);
        
        if (!id) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "ID is required"
            });
        }
        
        const todo = await todosService.getTodoById(id, userId);
        if (!todo) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Todo not found"
            });
        }
        
        return res.json({
            success: true,
            message: "Todo fetched successfully",
            data: todo
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching todo",
            error: error.message
        });
    }
}

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params || {};
        const userId = getUserId(req);
        const { title, description } = req.body || {};
        
        if (!id) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "ID is required"
            });
        }
        
        if (!title) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "Title is required"
            });
        }
        
        const todo = await todosService.updateTodo(id, userId, title, description || "");
        if (!todo) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Todo not found"
            });
        }
        
        return res.json({
            success: true,
            message: "Todo updated successfully",
            data: todo
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error updating todo",
            error: error.message
        });
    }
}

export const toggleTodoComplete = async (req, res) => {
    try {
        const { id } = req.params || {};
        const userId = getUserId(req);
        
        if (!id) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "ID is required"
            });
        }
        
        const todo = await todosService.toggleTodoComplete(id, userId);
        if (!todo) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Todo not found"
            });
        }
        
        return res.json({
            success: true,
            message: "Todo status updated successfully",
            data: todo
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error updating todo status",
            error: error.message
        });
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params || {};
        const userId = getUserId(req);
        
        if (!id) {
            return res.status(status.BAD_REQUEST).json({
                success: false,
                message: "ID is required"
            });
        }
        
        const todo = await todosService.deleteTodo(id, userId);
        if (!todo) {
            return res.status(status.NOT_FOUND).json({
                success: false,
                message: "Todo not found"
            });
        }
        
        return res.json({
            success: true,
            message: "Todo deleted successfully",
            data: todo
        });
    } catch (error) {
        return res.status(status.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error deleting todo",
            error: error.message
        });
    }
}