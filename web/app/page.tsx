'use client';

import { useState, useEffect } from 'react';
import { Todo, TodoFormData } from './types/todo';
import TodoTable from './components/TodoTable';
import AddTodoButton from './components/AddTodoButton';
import TodoForm from './components/TodoForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import AuthGuard from './components/AuthGuard';
import { useAuth } from './contexts/AuthContext';
import { useToast } from './contexts/ToastContext';
import { apiService } from './services/api';

function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [todoToDelete, setTodoToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const { showError, showSuccess } = useToast();

  // Fetch todos on mount and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchTodos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchTodos = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getTodos();
      // Map _id to id for compatibility and convert dates
      const todosWithId: Todo[] = response.data.map((todo) => ({
        _id: todo._id,
        id: todo._id,
        userId: todo.userId,
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
      setTodos(todosWithId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch todos';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = () => {
    setEditingTodo(null);
    setShowForm(true);
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleDeleteTodo = (id: string) => {
    const todo = todos.find(t => (t.id || t._id) === id);
    if (todo) {
      setTodoToDelete({ id: todo._id || todo.id || '', title: todo.title });
      setShowDeleteModal(true);
    }
  };

  const handleFormSubmit = async (data: TodoFormData) => {
    if (!user?.id) return;

    setError(null);
    try {
      if (editingTodo) {
        // Edit existing todo
        const todoId = editingTodo._id || editingTodo.id;
        if (!todoId) return;
        
        await apiService.updateTodo(todoId, data.title, data.description);
      } else {
        // Add new todo
        await apiService.createTodo(data.title, data.description);
      }
      
      // Refresh todos list
      await fetchTodos();
      setShowForm(false);
      setEditingTodo(null);
      showSuccess(editingTodo ? 'Todo updated successfully!' : 'Todo created successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save todo';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error saving todo:', err);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTodo(null);
    setError(null);
  };

  const handleToggleComplete = async (id: string) => {
    if (!user?.id) return;

    setError(null);
    try {
      await apiService.toggleTodoComplete(id);
      // Refresh todos list
      await fetchTodos();
      showSuccess('Todo status updated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update todo';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error toggling todo:', err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!todoToDelete || !user?.id) return;

    setError(null);
    try {
      await apiService.deleteTodo(todoToDelete.id);
      // Refresh todos list
      await fetchTodos();
      setShowDeleteModal(false);
      setTodoToDelete(null);
      showSuccess('Todo deleted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete todo';
      setError(errorMessage);
      showError(errorMessage);
      console.error('Error deleting todo:', err);
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
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Todo App
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your tasks efficiently
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Welcome,</div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
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
            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading todos...</p>
              </div>
            ) : (
              <TodoTable
                todos={todos}
                onToggleComplete={handleToggleComplete}
                onEdit={handleEditTodo}
                onDelete={handleDeleteTodo}
              />
            )}
          </div>
        </div>

        {showForm && (
          <TodoForm
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            initialData={editingTodo ? { title: editingTodo.title, description: editingTodo.description } : undefined}
            isEditing={!!editingTodo}
            error={error}
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

export default function Home() {
  return (
    <AuthGuard>
      <TodoApp />
    </AuthGuard>
  );
}
