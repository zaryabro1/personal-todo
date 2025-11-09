import { Todo } from "./index.js";

export const getTodos = async (userId) => {
    return await Todo.find({ userId }).sort({ createdAt: -1 });
}

export const createTodo = async (userId, title, description) => {
    return await Todo.create({ userId, title, description });
}

export const getTodoById = async (id, userId) => {
    return await Todo.findOne({ _id: id, userId });
}

export const updateTodo = async (id, userId, title, description) => {
    return await Todo.findOneAndUpdate(
        { _id: id, userId },
        { title, description },
        { new: true, runValidators: true }
    );
}

export const toggleTodoComplete = async (id, userId) => {
    const todo = await Todo.findOne({ _id: id, userId });
    if (!todo) {
        return null;
    }
    return await Todo.findOneAndUpdate(
        { _id: id, userId },
        { completed: !todo.completed },
        { new: true, runValidators: true }
    );
}

export const deleteTodo = async (id, userId) => {
    return await Todo.findOneAndDelete({ _id: id, userId });
}