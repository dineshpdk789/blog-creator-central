import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Post from "./pages/Post";
import Admin from "./pages/Admin";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import About from "./pages/About";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/post/:slug" element={<Post />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={
              <AuthGuard>
                <Admin />
              </AuthGuard>
            } />
            <Route path="/admin/create" element={
              <AuthGuard>
                <CreatePost />
              </AuthGuard>
            } />
            <Route path="/admin/edit/:id" element={
              <AuthGuard>
                <EditPost />
              </AuthGuard>
            } />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
