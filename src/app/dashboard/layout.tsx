"use client";
import React, { useState, useEffect } from 'react';
import { Menu, User, ChevronDown, LogOut } from 'lucide-react';
import Sidebar from '@/components/Sidebar/Sidebar';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, logout, isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Handle redirects based on authentication
  useEffect(() => {
    if (!loading && !isAuthenticated) {
    }
  }, [loading, isAuthenticated, router]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  // Handle clicking outside of user menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show loading state during authentication check
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar - different behavior for mobile vs desktop */}
      {isMobile ? (
        <>
          {/* Mobile overlay */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black/70 z-20"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Mobile sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-30 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}
          >
            <Sidebar collapsed={false} />
          </div>
        </>
      ) : (
        // Desktop sidebar
        <div className="flex-shrink-0 h-full">
          <Sidebar collapsed={sidebarCollapsed} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white border-b border-gray-200 z-10">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              {/* Hamburger menu */}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>
            </div>

            <div className="flex items-center space-x-4">
              {/* User profile dropdown */}
              <div className="flex items-center relative user-menu-container">
                <button
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-medium hidden md:block">{user?.name || 'Admin'}</span>
                  <ChevronDown size={14} className="hidden md:block" />
                </button>

                {/* User dropdown menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                    </div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut size={14} className="mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out`}
        >
          <div className="md:p-6 p-2">
      
              {children}
        
          </div>
        </main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}