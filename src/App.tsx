import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AICopyPreview from './pages/AICopyPreview';
import NotFound from './pages/NotFound';
import Legal from './pages/Legal';
import Admin from './pages/Admin';
import AdminClinics from './pages/AdminClinics';
import AdminUsers from './pages/AdminUsers';
import AdminSessions from './pages/AdminSessions';
import AdminWebsites from './pages/AdminWebsites';
import AdminDiagnostics from "./pages/AdminDiagnostics";
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <BrowserRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/legal" element={<Legal />} />
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
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <Admin />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/clinics" 
                    element={
                      <ProtectedRoute>
                        <AdminClinics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute>
                        <AdminUsers />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/sessions" 
                    element={
                      <ProtectedRoute>
                        <AdminSessions />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/websites" 
                    element={
                      <ProtectedRoute>
                        <AdminWebsites />
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
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
              </ErrorBoundary>
            </BrowserRouter>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
