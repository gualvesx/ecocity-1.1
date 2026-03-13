
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User, UserPlus, Shield, Edit, Bell, AlertTriangle, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const UserMenuSection = ({ 
  onLogout, 
  onClose 
}: { 
  onLogout?: () => void,
  onClose?: () => void
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    if (onLogout) onLogout();
    if (onClose) onClose();
  };

  const handleNavigate = (path: string) => {
    if (onClose) onClose();
    setTimeout(() => {
      navigate(path);
    }, 10);
  };

  if (isMobile) {
    return (
      <div className="px-4 py-4 border-t border-gray-100 dark:border-gray-700 mt-2 w-full">
        {user ? (
          <>
            <div className="flex items-center mb-3">
              <Avatar className="h-8 w-8 mr-2">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-eco-green text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-sm">
                <span className="text-muted-foreground">Olá, </span>
                <span className="font-medium text-foreground">{user.name}</span>
                {user.isAdmin && (
                  <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-eco-green text-white">
                    Admin
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-2">
              <Button
                variant="outline" 
                size="sm"
                onClick={() => handleNavigate('/profile')}
                className="w-full text-eco-green border-eco-green hover:bg-eco-green/10"
                type="button"
              >
                <Edit className="h-4 w-4 mr-2" />
                Meu Perfil
              </Button>
              
              {user.isAdmin && (
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => handleNavigate('/admin-dashboard')}
                  className="w-full text-eco-brown border-eco-brown hover:bg-eco-brown/10"
                  type="button"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Painel Admin
                </Button>
              )}
            </div>

            <Button
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="w-full text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
              type="button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleNavigate('/login')}
              className="w-full bg-eco-green hover:bg-eco-green-dark"
              type="button"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Entrar
            </Button>
            <Button
              variant="outline"
              onClick={() => handleNavigate('/register')}
              className="w-full"
              type="button"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Cadastrar
            </Button>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-3">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="relative h-10 w-10 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
              type="button"
            >
              <Avatar className="h-10 w-10">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-eco-green text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              {!user.emailVerified && (
                <div 
                  className="absolute top-0 right-0 h-3 w-3 bg-amber-500 rounded-full border-2 border-white dark:border-gray-900" 
                  title="Email não verificado"
                />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <div className="flex items-center gap-1 flex-wrap">
                  {user.isAdmin && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-eco-green text-white">
                      Admin
                    </span>
                  )}
                  {!user.emailVerified && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-white">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Email não verificado
                    </span>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleNavigate('/profile')}
              className="cursor-pointer"
            >
              <Edit className="h-4 w-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            {user.isAdmin && (
              <DropdownMenuItem 
                onClick={() => handleNavigate('/admin-dashboard')}
                className="cursor-pointer"
              >
                <Shield className="h-4 w-4 mr-2" />
                Painel Admin
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          <Button
            variant="ghost" 
            size="sm"
            onClick={() => handleNavigate('/register')}
            className="text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            type="button"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Cadastrar
          </Button>
          
          <Button
            size="sm"
            onClick={() => handleNavigate('/login')}
            className="bg-eco-green hover:bg-eco-green-dark"
            type="button"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Entrar
          </Button>
        </>
      )}
    </div>
  );
};
