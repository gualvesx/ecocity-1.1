
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Settings } from 'lucide-react';

export const FooterLinks = () => {
  const openCookieSettings = () => {
    if ((window as any).openCookieSettings) {
      (window as any).openCookieSettings();
    }
  };

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
      <Link 
        to="/privacy-policy" 
        className="flex items-center hover:text-foreground transition-colors"
      >
        <Shield className="h-3 w-3 mr-1" />
        Política de Privacidade
      </Link>
      
      <button 
        onClick={openCookieSettings}
        className="flex items-center hover:text-foreground transition-colors text-sm"
      >
        <Settings className="h-3 w-3 mr-1" />
        Configurações de Cookies
      </button>
    </div>
  );
};

export default FooterLinks;
