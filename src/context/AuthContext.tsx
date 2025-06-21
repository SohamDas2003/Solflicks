/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status once at component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check localStorage for existing admin authentication
        const userData = localStorage.getItem('admin_user');
        const token = localStorage.getItem('admin_token');

        if (userData && token) {
          // Set user data from localStorage
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          
          // Check if user is admin
          setIsAdmin(parsedUser.role === 'admin');
          
          // Set token for API requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        // Clear invalid data
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsAdmin(false);
      } finally {
        // Always set loading to false when done
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Handle redirects based on authentication status
  useEffect(() => {
    // Only redirect after initial loading is complete
    if (!loading) {
      // Handle restricted routes - user not authenticated but trying to access dashboard
      if ((!user || !isAdmin) && pathname !== '/login' && pathname?.includes('/dashboard')) {
        toast.error("You don't have permission to access the admin dashboard");
        router.push('/login');
      }
    }
  }, [loading, user, isAdmin, pathname, router]);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        email,
        password
      });
      
      const { token, user: userData } = response.data;
      
      // Check if user is admin
      if (userData.role !== 'admin') {
        throw new Error("You don't have permission to access the admin dashboard");
      }
      
      // Store auth data with admin-specific keys
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      
      // Set in-memory auth data
      setUser(userData);
      setIsAdmin(true);
      
      // Set auth header for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Navigate to dashboard directly from here
      router.push('/dashboard');
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    }
  };
  
  // Logout function
  const logout = () => {
    // Clear auth data
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    delete axios.defaults.headers.common['Authorization'];
    
    // Update state
    setUser(null);
    setIsAdmin(false);
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated: !!user,
      isAdmin,
      logout,
      login
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}