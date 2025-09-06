import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SiteHeader } from "@/components/SiteHeader";
import Index from "./pages/Index";
import AuthSignIn from "./pages/AuthSignIn";
import Dashboard from "./pages/Dashboard";
import Translation from "./pages/Translation";
import EmailAssistant from "./pages/EmailAssistant";
import WhatsAppPro from "./pages/WhatsAppPro";
import IndustryModules from "./pages/IndustryModules";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SiteHeader />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/auth/sign-in" element={<AuthSignIn />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/translation" element={
              <ProtectedRoute>
                <Translation />
              </ProtectedRoute>
            } />
            <Route path="/email" element={
              <ProtectedRoute>
                <EmailAssistant />
              </ProtectedRoute>
            } />
            <Route path="/whatsapp" element={
              <ProtectedRoute>
                <WhatsAppPro />
              </ProtectedRoute>
            } />
            <Route path="/industry" element={
              <ProtectedRoute>
                <IndustryModules />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
