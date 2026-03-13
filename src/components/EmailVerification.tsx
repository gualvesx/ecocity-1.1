
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';

interface EmailVerificationProps {
  email: string;
  onBack: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({ email, onBack }) => {
  const { sendVerificationEmail } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  
  // Auto-redirect to login after successful verification message display
  useEffect(() => {
    if (verificationSent) {
      const timer = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onBack(); // Return to login screen
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [verificationSent, onBack]);
  
  const handleResendVerification = async () => {
    setIsSubmitting(true);
    try {
      console.log("Resending verification email");
      await sendVerificationEmail();
      setVerificationSent(true);
      setSecondsLeft(5);
      toast.success('Email de verificação enviado! Verifique sua caixa de entrada.', {
        duration: 5000,
      });
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error('Erro ao enviar email de verificação.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="w-full">
      <button 
        onClick={onBack} 
        className="flex items-center text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar ao login
      </button>
      
      {verificationSent ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-center mb-2">Email enviado!</h3>
          
          <p className="text-center text-muted-foreground mb-4">
            Verifique seu email <strong>{email}</strong> e clique no link de verificação.
            Você será redirecionado para a página de login em {secondsLeft} segundos.
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-4">
            <Mail className="h-6 w-6 text-amber-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-center mb-2">Verifique seu email</h3>
          
          <p className="text-center text-muted-foreground mb-4">
            Enviamos um email de verificação para <strong>{email}</strong>. 
            Por favor, clique no link no email para verificar sua conta.
          </p>
          
          <p className="text-center text-sm mb-6">
            Se você não recebeu o email, verifique sua pasta de spam ou clique no botão abaixo para 
            enviar novamente.
          </p>
          
          <Button
            variant="outline"
            className="w-full border-amber-300 hover:bg-amber-100 text-amber-700"
            onClick={handleResendVerification}
            disabled={isSubmitting}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isSubmitting ? 'animate-spin' : ''}`} />
            {isSubmitting ? 'Enviando...' : 'Reenviar email de verificação'}
          </Button>
        </div>
      )}
      
      <p className="text-center text-sm text-muted-foreground">
        Precisa de ajuda? Entre em contato com nosso suporte.
      </p>
    </div>
  );
};

export default EmailVerification;
