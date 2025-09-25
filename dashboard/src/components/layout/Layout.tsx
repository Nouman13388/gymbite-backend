import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../../views/layout/Sidebar';
import { Header } from '../../views/layout/Header';

const Layout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Generate page title from route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';

    const segments = path.split('/').filter(Boolean);
    const page = segments[0];

    switch (page) {
      case 'users':
        return 'User Management';
      case 'workouts':
        return 'Workout Plans';
      case 'meals':
        return 'Meal Plans';
      case 'analytics':
        return 'Analytics';
      case 'settings':
        return 'Settings';
      default:
        return page ? page.charAt(0).toUpperCase() + page.slice(1) : 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#111418] flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={sidebarCollapsed} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <Header
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={toggleSidebar}
          title={getPageTitle()}
        />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
