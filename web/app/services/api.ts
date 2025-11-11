import { Todo } from '../types/todo';

// Normalize API base URL - remove trailing /api/v1 if present
const getApiBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6969';
  return url.replace(/\/api\/v1\/?$/, '');
};

const API_BASE_URL = getApiBaseUrl();
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// API Todo type (from MongoDB)
interface ApiTodo {
  _id: string;
  userId: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}/api/v1${endpoint}`;
    const token = this.getToken();
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          // Use the message from the API response if available
          errorMessage = errorData.message || errorData.error || errorMessage;
          
          // Provide user-friendly messages for common HTTP status codes
          if (response.status === 400) {
            errorMessage = errorData.message || 'Invalid request. Please check your input.';
          } else if (response.status === 401) {
            errorMessage = errorData.message || 'Unauthorized. Please log in again.';
          } else if (response.status === 403) {
            errorMessage = errorData.message || 'Access forbidden.';
          } else if (response.status === 404) {
            errorMessage = errorData.message || 'Resource not found.';
          } else if (response.status === 500) {
            errorMessage = errorData.message || 'Server error. Please try again later.';
          } else if (response.status >= 500) {
            errorMessage = errorData.message || 'Server error. Please try again later.';
          }
        } catch {
          // If response is not JSON, provide user-friendly messages based on status
          if (response.status === 400) {
            errorMessage = 'Invalid request. Please check your input.';
          } else if (response.status === 401) {
            errorMessage = 'Unauthorized. Please log in again.';
          } else if (response.status === 403) {
            errorMessage = 'Access forbidden.';
          } else if (response.status === 404) {
            errorMessage = 'Resource not found.';
          } else if (response.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
          }
        }
        throw new Error(errorMessage);
      }
      
      // Try to parse JSON response
      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error('Invalid response from server');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        // Check if it's a network/fetch error
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError') || error.message.includes('Network request failed')) {
          const port = process.env.NEXT_PUBLIC_API_URL?.match(/:(\d+)/)?.[1] || '6969';
          throw new Error(`Cannot connect to server. Please make sure the backend server is running on port ${port}.`);
        }
        // If it's already a formatted error message, throw it as is
        throw error;
      }
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }

  // Get all todos for the authenticated user
  async getTodos(): Promise<ApiResponse<ApiTodo[]>> {
    return this.request<ApiTodo[]>('/todos', {
      method: 'GET',
    });
  }

  // Create a new todo
  async createTodo(title: string, description: string = ''): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>('/todos', {
      method: 'POST',
      body: JSON.stringify({ title, description }),
    });
  }

  // Get a todo by ID
  async getTodoById(id: string): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}`, {
      method: 'GET',
    });
  }

  // Update a todo
  async updateTodo(id: string, title: string, description: string = ''): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    });
  }

  // Toggle todo complete status
  async toggleTodoComplete(id: string): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}/toggle`, {
      method: 'PATCH',
    });
  }

  // Delete a todo
  async deleteTodo(id: string): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
