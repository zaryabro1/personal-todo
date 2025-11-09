import { Todo } from '../types/todo';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
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
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
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
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          const port = process.env.NEXT_PUBLIC_API_URL?.match(/:(\d+)/)?.[1] || '6969';
          throw new Error(`Cannot connect to server. Please make sure the backend server is running on port ${port}.`);
        }
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // Helper to add userId to headers
  private getHeaders(userId: string): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'x-user-id': userId,
    };
  }

  // Get all todos for a user
  async getTodos(userId: string): Promise<ApiResponse<ApiTodo[]>> {
    return this.request<ApiTodo[]>(`/todos?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: this.getHeaders(userId),
    });
  }

  // Create a new todo
  async createTodo(userId: string, title: string, description: string = ''): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>('/todos', {
      method: 'POST',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ userId, title, description }),
    });
  }

  // Get a todo by ID
  async getTodoById(userId: string, id: string): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}`, {
      method: 'GET',
      headers: this.getHeaders(userId),
    });
  }

  // Update a todo
  async updateTodo(userId: string, id: string, title: string, description: string = ''): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ userId, title, description }),
    });
  }

  // Toggle todo complete status
  async toggleTodoComplete(userId: string, id: string): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}/toggle`, {
      method: 'PATCH',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ userId }),
    });
  }

  // Delete a todo
  async deleteTodo(userId: string, id: string): Promise<ApiResponse<ApiTodo>> {
    return this.request<ApiTodo>(`/todos/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(userId),
      body: JSON.stringify({ userId }),
    });
  }
}

export const apiService = new ApiService();
