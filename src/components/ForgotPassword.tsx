
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ForgotPasswordProps {
  onBack: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  
  // Auto-redirect to login after successful reset email with countdown
  useEffect(() => {
    if (success) {
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
  }, [success, onBack]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (!email.trim()) {
        toast.error('Por favor, informe seu email');
        setIsSubmitting(false);
        return;
      }
      
      console.log("Requesting password reset for:", email);
      const resetSuccess = await sendPasswordReset(email);
      
      if (resetSuccess) {
        setSuccess(true);
        setSecondsLeft(5);
        toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.', {
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Error in password reset:', error);
      toast.error('Erro ao enviar email de recuperação');
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
      
      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-4">
            <Check className="h-6 w-6 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-center mb-2">Email enviado!</h3>
          
          <p className="text-center text-muted-foreground mb-4">
            Enviamos um email para <strong>{email}</strong> com instruções para redefinir sua senha.
            Você será redirecionado para a página de login em {secondsLeft} segundos.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-eco-green-dark">Esqueci minha senha</h1>
            <p className="text-muted-foreground mt-2">
              Informe seu email para receber um link de recuperação de senha
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-eco-green hover:bg-eco-green-dark"
              disabled={isSubmitting}
            >
              <KeyRound className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Enviando...' : 'Enviar link de recuperação'}
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
