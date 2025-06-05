
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

// Import public pages
import Index from './pages/Index';
import Landing from './pages/Landing';
import About from './pages/About';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import Templates from './pages/Templates';
import Blog from './pages/Blog';
import BlogArticle from './pages/BlogArticle';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ErrorBoundary>
              <Routes>
                {/* Public routes - no authentication required */}
                <Route path="/" element={<Landing />} />
                <Route path="/index" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/templates" element={<Templates />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogArticle />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
                {/* Protected routes - authentication required */}
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
                
                {/* Fallback routes */}
                <Route path="/not-found" element={<NotFound />} />
                <Route path="*" element={<NotFound />} />
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
