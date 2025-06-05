
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Account from "./pages/Account";
import Onboarding from "./pages/Onboarding";
import TemplatePreview from "./pages/TemplatePreview";
import WebsitePreview from "./pages/WebsitePreview";
import WebsiteBuilderPage from "./pages/WebsiteBuilder";
import UnifiedDashboard from "./pages/UnifiedDashboard";
import AiCopyPreview from "./pages/AiCopyPreview";
import Templates from "./pages/Templates";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import HowItWorks from "./pages/HowItWorks";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        storageKey="molarix-theme"
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <LanguageProvider>
            <AuthProvider>
              <Toaster />
              <BrowserRouter>
                <ErrorBoundary>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/templates" element={<Templates />} />
                    <Route path="/features" element={<Features />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogArticle />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    
                    {/* Protected routes */}
                    <Route path="/dashboard" element={<ProtectedRoute><UnifiedDashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/personal" element={<ProtectedRoute><UnifiedDashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/clinic" element={<ProtectedRoute><UnifiedDashboard /></ProtectedRoute>} />
                    <Route path="/dashboard/websites" element={<ProtectedRoute><UnifiedDashboard /></ProtectedRoute>} />
                    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
                    <Route path="/template-preview" element={<ProtectedRoute><TemplatePreview /></ProtectedRoute>} />
                    <Route path="/website-preview/:websiteId" element={<ProtectedRoute><WebsitePreview /></ProtectedRoute>} />
                    <Route path="/website-builder/:websiteId" element={<ProtectedRoute><WebsiteBuilderPage /></ProtectedRoute>} />
                    <Route path="/ai-copy-preview/:sessionId" element={<ProtectedRoute><AiCopyPreview /></ProtectedRoute>} />
                    
                    {/* 404 fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </ErrorBoundary>
              </BrowserRouter>
            </AuthProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
