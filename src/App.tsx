
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import AICopyPreview from './pages/AiCopyPreview';
import WebsiteBuilderPage from './pages/WebsiteBuilder';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDiagnostics from "./pages/AdminDiagnostics";
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ai-copy-preview" element={<ProtectedRoute><AICopyPreview /></ProtectedRoute>} />
                
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/website-builder/:websiteId" 
                  element={
                    <ProtectedRoute>
                      <WebsiteBuilderPage />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/diagnostics" 
                  element={
                    <ProtectedRoute>
                      <AdminDiagnostics />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<Dashboard />} />
              </Routes>
              <Toaster />
            </ErrorBoundary>
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
