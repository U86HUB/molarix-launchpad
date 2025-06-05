
import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import BreadcrumbNav from '@/components/ui/breadcrumb-nav';

interface UnifiedDashboardLayoutProps {
  children: React.ReactNode;
  currentSection: string;
}

export const UnifiedDashboardLayout = ({ children, currentSection }: UnifiedDashboardLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <BreadcrumbNav 
                  items={[
                    { label: 'Dashboard' },
                    { label: currentSection }
                  ]} 
                  showHome={false} 
                />
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
