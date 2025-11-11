'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types/auth';

interface StoredUser {
  id: string;
  email: string;
  password: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Load user from localStorage on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem('user');
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Frontend-only authentication for now
    // In a real app, this would call your API
    if (typeof window === 'undefined') {
      return { success: false, error: 'Cannot authenticate in server environment' };
    }
    
    // Validation
    if (!email.trim()) {
      return { success: false, error: 'Email is required' };
    }
    
    if (!password) {
      return { success: false, error: 'Password is required' };
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user exists in localStorage (simple demo)
      const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (!foundUser) {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }
      
      if (foundUser.password !== password) {
        setIsLoading(false);
        return { success: false, error: 'Invalid email or password' };
      }
      
      const userData: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An error occurred during login. Please try again.' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    // Frontend-only authentication for now
    if (typeof window === 'undefined') {
      return { success: false, error: 'Cannot sign up in server environment' };
    }
    
    // Validation
    if (!name.trim()) {
      return { success: false, error: 'Name is required' };
    }
    
    if (name.trim().length < 2) {
      return { success: false, error: 'Name must be at least 2 characters long' };
    }
    
    if (!email.trim()) {
      return { success: false, error: 'Email is required' };
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }
    
    if (!password) {
      return { success: false, error: 'Password is required' };
    }
    
    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if user already exists
      const storedUsers: StoredUser[] = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        setIsLoading(false);
        return { success: false, error: 'An account with this email already exists' };
      }
      
      // Create new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email: email.trim(),
        password, // In production, this would be hashed
        name: name.trim()
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'An error occurred during sign up. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          isAuthenticated: false,
          login,
          signup,
          logout,
          isLoading: true
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
