'use client';

import { ReactNode } from 'react';

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {sidebar}
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}