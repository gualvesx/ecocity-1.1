
import { ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { EmailVerification } from './EmailVerification';

interface AuthGuardProps {
  children: ReactNode;
  requireVerification?: boolean;
}

export const AuthGuard = ({ children, requireVerification = true }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    // Check if user is logged in but email is not verified
    if (user && requireVerification && !user.emailVerified && !showVerification) {
      toast.warning('Por favor, verifique seu email para acessar esta página.');
      setShowVerification(true);
    }
  }, [user, requireVerification, showVerification]);

  // Still loading auth state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-eco-green"></div>
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    toast.error('Você precisa estar logado para acessar esta página.');
    return <Navigate to="/login" replace />;
  }

  // User authenticated but email not verified and verification required
  if (requireVerification && !user.emailVerified && showVerification) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <EmailVerification 
              email={user.email} 
              onBack={() => setShowVerification(false)} 
            />
          </div>
        </div>
      </div>
    );
  }

  // User authenticated and email verified (or verification not required)
  return <>{children}</>;
};

export default AuthGuard;
