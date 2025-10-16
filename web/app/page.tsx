'use client';

import { useState } from 'react';
import { Todo, TodoFormData } from './types/todo';
import TodoTable from './components/TodoTable';
import AddTodoButton from './components/AddTodoButton';
import TodoForm from './components/TodoForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<{ id: string; title: string } | null>(null);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddTodo = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setTodoToDelete({ id, title: todo.title });
      setShowDeleteModal(true);
    }
  };

  const handleFormSubmit = (data: TodoFormData) => {
    if (editingTodo) {
      // Edit existing todo
      setTodos(prev => prev.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, ...data, updatedAt: new Date() }
          : todo
      ));
    } else {
      // Add new todo
      const newTodo: Todo = {
        id: generateId(),
        ...data,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTodos(prev => [...prev, newTodo]);
    }
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
  };

  const handleToggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ));
  };

  const handleConfirmDelete = () => {
    if (todoToDelete) {
      setTodos(prev => prev.filter(todo => todo.id !== todoToDelete.id));
      setShowDeleteModal(false);
      setTodoToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTodoToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Todo App
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your tasks efficiently
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Your Todos
              </h2>
              <AddTodoButton onClick={handleAddTodo} />
            </div>
          </div>
          
          <div className="p-6">
            <TodoTable
              todos={todos}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditTodo}
              onDelete={handleDeleteTodo}
            />
          </div>
        </div>

        {showForm && (
          <TodoForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            initialData={editingTodo ? { title: editingTodo.title, description: editingTodo.description } : undefined}
            isEditing={!!editingTodo}
          />
        )}

        {showDeleteModal && todoToDelete && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            todoTitle={todoToDelete.title}
          />
        )}
      </div>
    </div>
  );
}
