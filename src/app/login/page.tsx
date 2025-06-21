/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/context/AuthContext';
import { AtSymbolIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!loading && isAuthenticated && isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router, loading]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success('Login successful');
    } catch (error: any) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show placeholder during initial authentication check
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-gray-700 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-light">Verifying credentials...</p>
        </div>
      </div>
    );
  }
  
  // Don't render login form if already authenticated
  if (isAuthenticated && isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-t-2 border-gray-700 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-light">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-light text-gray-800">Solflicks Filmworks</h1>
          <p className="text-sm text-gray-500 mt-1">Admin Dashboard</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <h2 className="text-xl font-light text-gray-800 mb-6">Sign in</h2>
            
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSymbolIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 block w-full px-3 py-2.5 border border-gray-200 rounded-md text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="admin@example.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyIcon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 block w-full px-3 py-2.5 border border-gray-200 rounded-md text-gray-800 text-sm focus:outline-none focus:border-gray-400 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2.5 px-4 border rounded-md text-sm font-medium transition-colors
                    ${isLoading 
                      ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                      : 'bg-gray-800 hover:bg-gray-700 text-white border-transparent'
                    }
                  `}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          </div>
          
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">
              Authorized personnel only
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Solflicks Filmwork | All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}