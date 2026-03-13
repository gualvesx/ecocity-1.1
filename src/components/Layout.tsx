
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { EcoAssistant } from './EcoAssistant';
import { AccessibilityPanel } from './AccessibilityPanel';
import CookieConsent from './CookieConsent';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
      
      {/* Posicionamento dos componentes flutuantes para evitar sobreposição com reCAPTCHA */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
        <AccessibilityPanel />
        <EcoAssistant />
      </div>
      
      <CookieConsent />
    </div>
  );
};

export default Layout;
