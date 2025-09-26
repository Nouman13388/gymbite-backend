import React, { useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../views/layout/Sidebar';
import { Header } from '../../views/layout/Header';

// Error Boundary Component for Layout
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class LayoutErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Layout Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#111418] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Enhanced page title configuration with better maintainability
interface PageTitleConfig {
  title: string;
  description?: string;
}

const PAGE_TITLE_MAP: Record<string, PageTitleConfig> = {
  '': { title: 'Dashboard', description: 'Overview of platform metrics and activity' },
  'users': { title: 'User Management', description: 'Manage platform users and their roles' },
  'workouts': { title: 'Workout Plans', description: 'Create and manage workout routines' },
  'meals': { title: 'Meal Plans', description: 'Design and oversee nutrition plans' },
  'analytics': { title: 'Analytics', description: 'Platform usage statistics and insights' },
  'settings': { title: 'Settings', description: 'Configure application preferences' },
  'profile': { title: 'Profile', description: 'Manage your account settings' },
  'notifications': { title: 'Notifications', description: 'View and manage notifications' },
};

const Layout: React.FC = () => {
  const location = useLocation();

  /**
   * Enhanced page title generation using configuration map
   * @returns Page title with fallback handling
   */
  const getPageTitle = useMemo(() => {
    const path = location.pathname;
    const segments = path.split('/').filter(Boolean);
    const pageKey = segments[0] || '';

    // Get title from configuration map
    const pageConfig = PAGE_TITLE_MAP[pageKey];
    if (pageConfig) {
      return pageConfig.title;
    }

    // Fallback for dynamic routes or unknown pages
    if (pageKey) {
      return pageKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }

    // Ultimate fallback
    return 'Dashboard';
  }, [location.pathname]);



  return (
    <LayoutErrorBoundary>
      <div className="min-h-screen bg-[#111418] flex">
        {/* Fixed Sidebar */}
        <div className="w-64" role="navigation" aria-label="Main navigation">
          <Sidebar />
        </div>

        {/* Main content area with proper semantic structure */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Enhanced Header with better accessibility */}
          <header role="banner" aria-label="Page header">
            <Header title={getPageTitle} />
          </header>

          {/* Main content with improved accessibility and error boundaries */}
          <main
            className="flex-1 overflow-auto bg-[#111418] focus-within:outline-none"
            role="main"
            aria-label="Main content"
            tabIndex={-1}
            id="main-content"
          >
            <LayoutErrorBoundary>
              <Outlet />
            </LayoutErrorBoundary>
          </main>
        </div>
      </div>
    </LayoutErrorBoundary>
  );
};

export default Layout;
