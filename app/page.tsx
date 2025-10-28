"use client";

import React, { useState } from 'react';
import type { AppUser } from '@/components/login-page';

// Import the components for different pages
import LoginPage from '@/components/login-page';
import DashboardView from '@/components/dashboard-view';
import FormView from '@/components/form-view';
import ReportsView from '@/components/reports-view';
import ReceivingPage from '@/components/receiving-form';
import ReportDetailView from '@/components/report-detail-view';

// Import UI components for the layout
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Import icons for the sidebar
import {
  LogOut,
  LayoutDashboard,
  FilePlus,
  BarChart3,
  Archive,
} from 'lucide-react';

// Define mappings for page components, icons, and labels for easy rendering
const pageComponents: { [key: string]: React.FC<any> } = {
  dashboard: DashboardView,
  form: FormView,
  reports: ReportsView,
  receiving: ReceivingPage,
};

const pageIcons: { [key: string]: React.ElementType } = {
  dashboard: LayoutDashboard,
  form: FilePlus,
  reports: BarChart3,
  receiving: Archive,
};

const pageLabels: { [key: string]: string } = {
  dashboard: 'Dashboard',
  form: 'Add Entry',
  reports: 'Reports',
  receiving: 'Receiving',
};


/**
 * This is the main entry point for your application.
 * It now manages user state and displays either the login screen or the
 * main application with a sidebar and content views.
 */
export default function Page() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [activeView, setActiveView] = useState<string>('');
  const [detailViewData, setDetailViewData] = useState<any | null>(null);

  // This function is passed to the LoginPage to handle successful logins
  const handleLogin = (user: AppUser) => {
    setCurrentUser(user);
    const initialView = user.pages.includes('dashboard') ? 'dashboard' : user.pages[0] || '';
    setActiveView(initialView);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('');
    setDetailViewData(null);
  };
  
  // This function handles navigation from the Reports view to its detail view
  const handleShowDetailView = (detail: any) => {
      setDetailViewData(detail);
  };

  // This function handles returning from the detail view back to the reports list
  const handleBackToReports = () => {
      setDetailViewData(null);
      setActiveView('reports');
  }

  // If no user is logged in, render the login page
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  // If viewing a specific report detail, render only that component
  if (detailViewData) {
      return <ReportDetailView detail={detailViewData} onBack={handleBackToReports} currentUser={currentUser} />
  }

  // Otherwise, render the main application layout with sidebar
  const ActiveComponent = pageComponents[activeView];
  const userInitial = currentUser.name.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <Sidebar className="bg-white border-r border-slate-200">
        <SidebarHeader className="p-6 border-b border-slate-200">
            <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-purple-100 text-purple-700 font-bold text-lg">{userInitial}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-slate-800">{currentUser.name}</span>
                    <span className="text-sm text-slate-500 capitalize">{currentUser.role}</span>
                </div>
            </div>
        </SidebarHeader>
        <SidebarContent className="p-4">
          <SidebarMenu className="flex flex-col gap-2">
            {currentUser.pages
                .filter(page => pageComponents[page]) // Only show links for pages that exist
                .map((page) => {
                    const Icon = pageIcons[page] || LayoutDashboard;
                    return (
                        <SidebarMenuItem key={page}>
                            <SidebarMenuButton
                                size="lg"
                                onClick={() => setActiveView(page)}
                                isActive={activeView === page}
                                tooltip={pageLabels[page]}
                                className="group text-slate-600 hover:bg-purple-50 hover:text-purple-700 data-[active=true]:bg-purple-100 data-[active=true]:text-purple-700 data-[active=true]:font-bold gap-4"
                            >
                                <Icon className="size-5 text-slate-500 group-hover:text-purple-700 data-[active=true]:text-purple-700" />
                                <span className="text-base">{pageLabels[page]}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto">
            <div className="my-2 py-3 text-center border-t border-slate-200">
                <p className="text-xs text-slate-500">
                    Powered by{' '}
                    <a
                        href="https://www.botivate.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-purple-600 hover:underline"
                    >
                        Botivate
                    </a>
                </p>
            </div>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                        size="lg"
                        onClick={handleLogout} 
                        className="group w-full justify-start text-slate-600 hover:bg-red-50 hover:text-red-600 gap-4"
                    >
                        <LogOut className="size-5 text-slate-500 group-hover:text-red-600" />
                        <span className="text-base">Logout</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center gap-4 border-b bg-white p-4 sticky top-0 z-10">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-bold text-slate-800">{pageLabels[activeView] || 'App'}</h1>
        </header>
        <main className="flex-1 overflow-auto bg-slate-50">
            {ActiveComponent && (
                <ActiveComponent
                    currentUser={currentUser}
                    // Pass the detail view handler specifically to the ReportsView component
                    {...(activeView === 'reports' && { onDetailClick: handleShowDetailView })}
                />
            )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}