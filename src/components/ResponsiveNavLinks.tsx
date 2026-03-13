
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { useIsMobile } from '@/hooks/use-mobile';

export const ResponsiveNavLinks = ({ 
  onClick 
}: { 
  onClick?: () => void 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isMobile) {
      navigate('/MapaTelaCheia');
    } else {
      navigate('/map');
    }
    onClick?.();
  };
  
  const navItems = [
    { name: 'Início', path: '/' },
    { name: 'Mapa', path: '/map', onClick: handleMapClick },
    { name: 'Sumário', path: '/summary' },
    { name: 'Eventos', path: '/events' },
    { name: 'Blog', path: '/blog' },
    { name: 'Sobre', path: '/about' },
  ];

  if (isMobile) {
    return (
      <ul className="flex flex-col space-y-1 w-full">
        {navItems.map((item) => (
          <li key={item.name}>
            {item.onClick ? (
              <button
                onClick={item.onClick}
                className={cn(
                  "block px-4 py-2 rounded-md transition-colors w-full text-left",
                  (location.pathname === item.path || (item.path === '/map' && location.pathname === '/MapaTelaCheia'))
                    ? "bg-eco-green-light/20 text-eco-green-dark font-medium"
                    : "hover:bg-eco-green-light/10"
                )}
              >
                {item.name}
              </button>
            ) : (
              <Link
                to={item.path}
                className={cn(
                  "block px-4 py-2 rounded-md transition-colors w-full text-left",
                  location.pathname === item.path
                    ? "bg-eco-green-light/20 text-eco-green-dark font-medium"
                    : "hover:bg-eco-green-light/10"
                )}
                onClick={onClick}
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {navItems.map((item) => (
          <NavigationMenuItem key={item.name}>
            {item.onClick ? (
              <button onClick={item.onClick}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "px-4 py-2 font-medium transition-colors relative group",
                    (location.pathname === item.path || (item.path === '/map' && location.pathname === '/MapaTelaCheia'))
                      ? "text-eco-green-dark bg-eco-green-light/20" 
                      : "text-foreground/80 hover:text-eco-green-dark"
                  )}
                >
                  {item.name}
                  <span 
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-0.5 bg-eco-green-dark transform scale-x-0 transition-transform origin-left group-hover:scale-x-100",
                      (location.pathname === item.path || (item.path === '/map' && location.pathname === '/MapaTelaCheia')) && "scale-x-100"
                    )}
                  />
                </NavigationMenuLink>
              </button>
            ) : (
              <Link to={item.path} onClick={onClick}>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "px-4 py-2 font-medium transition-colors relative group",
                    location.pathname === item.path 
                      ? "text-eco-green-dark bg-eco-green-light/20" 
                      : "text-foreground/80 hover:text-eco-green-dark"
                  )}
                >
                  {item.name}
                  <span 
                    className={cn(
                      "absolute bottom-0 left-0 w-full h-0.5 bg-eco-green-dark transform scale-x-0 transition-transform origin-left group-hover:scale-x-100",
                      location.pathname === item.path && "scale-x-100"
                    )}
                  />
                </NavigationMenuLink>
              </Link>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
