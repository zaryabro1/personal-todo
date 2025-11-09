'use client';

import { Todo } from '../types/todo';

interface TodoTableProps {
  todos: Todo[];
  onToggleComplete: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

export default function TodoTable({ todos, onToggleComplete, onEdit, onDelete }: TodoTableProps) {
  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">No todos yet</div>
        <div className="text-gray-400 text-sm">Add your first todo to get started!</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Title</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo._id || todo.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50">
              <td className="py-3 px-4">
                <div className={`font-medium ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {todo.title}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className={`text-sm ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-300'}`}>
                  {todo.description}
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onToggleComplete(todo._id || todo.id || '')}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    todo.completed
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                >
                  {todo.completed ? '✓ Completed' : '○ Pending'}
                </button>
              </td>
              <td className="py-3 px-4 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(todo)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(todo._id || todo.id || '')}
                    className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
