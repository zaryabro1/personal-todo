import { Todo } from "./index.js";

export const getTodos = async () => {
    return await Todo.find();
}

export const createTodo = async (title, description) => {
    return await Todo.create({ title, description });
}

export const getTodoById = async (id) => {
    return await Todo.findById(id);
}

export const updateTodo = async (id, title, description) => {
    return await Todo.findByIdAndUpdate(id, { title, description }, { new: true, runValidators: true });
}

export const deleteTodo = async (id) => {
    return await Todo.findByIdAndDelete(id);
}