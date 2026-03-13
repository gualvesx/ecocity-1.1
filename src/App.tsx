
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ReCaptchaProvider } from '@/contexts/ReCaptchaContext';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import AuthGuard from '@/components/AuthGuard';
import Index from '@/pages/Index';
import Events from '@/pages/Events';
import EventDetails from '@/pages/EventDetails';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import UserProfile from '@/pages/UserProfile';
import EcologicalMap from '@/pages/EcologicalMap';
import MapaTelaCheia from '@/pages/MapaTelaCheia';
import EventTelaCheia from '@/pages/EventTelaCheia';
import EventMapTelaCheia from '@/pages/EventMapTelaCheia';
import MapSummary from '@/pages/MapSummary';
import MapPointDetails from '@/pages/MapPointDetails';
import MyMapRequests from '@/pages/MyMapRequests';
import AdminDashboard from '@/pages/AdminDashboard';
import NotFound from '@/pages/NotFound';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import About from '@/pages/About';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import { EditBlogPost } from '@/components/blog/EditBlogPost';
import Summary from '@/pages/Summary';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReCaptchaProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <LanguageProvider>
            <AuthProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/summary" element={<Summary />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/events" element={
                      <AuthGuard requireVerification={false}>
                        <Events />
                      </AuthGuard>
                    } />
                    <Route path="/event/:id" element={
                      <AuthGuard requireVerification={false}>
                        <EventDetails />
                      </AuthGuard>
                    } />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/map" element={
                      <AuthGuard requireVerification={false}>
                        <EcologicalMap />
                      </AuthGuard>
                    } />
                    <Route path="/MapaTelaCheia" element={
                      <AuthGuard requireVerification={false}>
                        <MapaTelaCheia />
                      </AuthGuard>
                    } />
                    <Route path="/EventTelaCheia" element={
                      <AuthGuard requireVerification={false}>
                        <EventTelaCheia />
                      </AuthGuard>
                    } />
                    <Route path="/EventMapTelaCheia" element={
                      <AuthGuard requireVerification={false}>
                        <EventMapTelaCheia />
                      </AuthGuard>
                    } />
                    <Route path="/map-summary" element={
                      <AuthGuard requireVerification={false}>
                        <MapSummary />
                      </AuthGuard>
                    } />
                    <Route path="/map-point/:id" element={
                      <AuthGuard requireVerification={false}>
                        <MapPointDetails />
                      </AuthGuard>
                    } />
                    <Route path="/my-requests" element={<MyMapRequests />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/new" element={
                      <AuthGuard requireVerification={false}>
                        <EditBlogPost />
                      </AuthGuard>
                    } />
                    <Route path="/blog/edit/:slug" element={
                      <AuthGuard requireVerification={false}>
                        <EditBlogPost />
                      </AuthGuard>
                    } />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </Router>
              <Toaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </ReCaptchaProvider>
    </QueryClientProvider>
  );
}

export default App;
