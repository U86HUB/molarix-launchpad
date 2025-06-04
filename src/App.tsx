
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorBoundary from "@/components/ErrorBoundary";

// Pages
import Index from "@/pages/Index";
import Landing from "@/pages/Landing";
import Features from "@/pages/Features";
import HowItWorks from "@/pages/HowItWorks";
import Templates from "@/pages/Templates";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogArticle from "@/pages/BlogArticle";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Onboarding from "@/pages/Onboarding";
import AiCopyPreview from "@/pages/AiCopyPreview";
import TemplatePreview from "@/pages/TemplatePreview";
import Account from "@/pages/Account";
import ClinicSettings from "@/pages/ClinicSettings";
import NotFound from "@/pages/NotFound";
import WebsiteBuilder from "@/pages/WebsiteBuilder";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ErrorBoundary>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <LanguageProvider>
              <AuthProvider>
                <div className="min-h-screen">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogArticle />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/auth" element={<Auth />} />

                    {/* Protected routes */}
                    <Route path="/dashboard" element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/onboarding" element={
                      <ProtectedRoute>
                        <Onboarding />
                      </ProtectedRoute>
                    } />
                    <Route path="/ai-copy-preview" element={
                      <ProtectedRoute>
                        <AiCopyPreview />
                      </ProtectedRoute>
                    } />
                    <Route path="/template-preview" element={
                      <ProtectedRoute>
                        <TemplatePreview />
                      </ProtectedRoute>
                    } />
                    <Route path="/account" element={
                      <ProtectedRoute>
                        <Account />
                      </ProtectedRoute>
                    } />
                    <Route path="/clinic-settings/:clinicId" element={
                      <ProtectedRoute>
                        <ClinicSettings />
                      </ProtectedRoute>
                    } />
                    <Route path="/website-builder/:websiteId" element={
                      <ProtectedRoute>
                        <WebsiteBuilder />
                      </ProtectedRoute>
                    } />

                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </div>
                <Toaster />
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
