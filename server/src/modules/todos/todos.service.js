import { Todo } from "./index.js";

export const getTodos = async () => {
    return await Todo.find();
}

export const createTodo = async (title, description) => {
    return await Todo.create({ title, description });
}