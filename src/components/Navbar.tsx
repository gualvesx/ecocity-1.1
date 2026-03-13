
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { UserMenuSection } from '@/components/UserMenuSection';
import { ResponsiveNavLinks } from '@/components/ResponsiveNavLinks';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme: _ } = useTheme(); // Renamed to _ to avoid unused variable warning
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        scrolled 
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo e nome no canto esquerdo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="h-8 w-8 overflow-hidden rounded-full">
              <img src="https://i.ibb.co/Kpzb67W3/LOGO.png" alt="EcoCity Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-semibold text-xl text-eco-green-dark dark:text-eco-green-light">EcoCity</span>
          </Link>
          
          {/* Desktop navigation - Centralizado */}
          <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-8">
            <ResponsiveNavLinks />
          </div>
          
          {/* User menu no canto direito - Sempre visível */}
          <div className="hidden md:flex items-center flex-shrink-0">
            <UserMenuSection onLogout={handleLogout} />
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="text-foreground focus:outline-none p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu - Using Collapsible for smooth animation */}
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="md:hidden border-t border-gray-200 dark:border-gray-700"
      >
        <CollapsibleContent className="bg-white dark:bg-gray-900 shadow-lg">
          <div className="py-2">
            <ResponsiveNavLinks onClick={() => setIsOpen(false)} />
            <UserMenuSection onLogout={handleLogout} onClose={() => setIsOpen(false)} />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </header>
  );
};

export default Navbar;
