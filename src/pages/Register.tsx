import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Leaf, User, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import EmailVerification from '@/components/EmailVerification';
import { PasswordInput } from '@/components/PasswordInput';
import { useCaptcha } from '@/hooks/useCaptcha';

const Register = () => {
  const { register, loginWithGoogle, isLoading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const { execute: executeCaptcha, loading: captchaLoading } = useCaptcha({
    action: 'register'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLocalLoading(true);

    try {
      // Validações básicas
      if (!name.trim()) {
        setError('Nome é obrigatório');
        setLocalLoading(false);
        return;
      }

      if (!email.trim()) {
        setError('E-mail é obrigatório');
        setLocalLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('As senhas não coincidem');
        setLocalLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres');
        setLocalLoading(false);
        return;
      }

      // Validar requisitos de senha
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
      const hasNumber = /\d/.test(password);

      if (!hasUppercase || !hasLowercase || !hasSpecial || !hasNumber) {
        setError('A senha deve conter pelo menos: 1 maiúscula, 1 minúscula, 1 caractere especial e 1 número');
        setLocalLoading(false);
        return;
      }

      console.log("Executando reCAPTCHA para registro...");
      const captchaResult = await executeCaptcha();
      
      if (!captchaResult || !captchaResult.verified) {
        toast.error('Falha na verificação reCAPTCHA. Tente novamente.');
        setLocalLoading(false);
        return;
      }

      console.log("Attempting to register user:", name, email);
      const success = await register(name, email, password, captchaResult.token);
      
      if (success) {
        console.log("Registration successful");
        setShowVerification(true);
      } else {
        console.log("Registration failed");
        setError('Falha ao criar conta. Tente novamente.');
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está em uso. Tente outro e-mail.');
      } else if (err.code === 'auth/invalid-email') {
        setError('E-mail inválido. Por favor, verifique.');
      } else if (err.code === 'auth/weak-password') {
        setError('Senha muito fraca. Use uma senha mais forte.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta';
        setError(errorMessage);
      }
      
      toast.error("Erro ao criar conta");
    } finally {
      setLocalLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLocalLoading(true);
    
    try {
      console.log("Executando reCAPTCHA para Google register...");
      const captchaResult = await executeCaptcha();
      
      if (!captchaResult || !captchaResult.verified) {
        toast.error('Falha na verificação reCAPTCHA. Tente novamente.');
        setLocalLoading(false);
        return;
      }

      const success = await loginWithGoogle(captchaResult.token);
      if (success) {
        navigate('/map');
        toast.success('Conta criada com sucesso!');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Erro ao criar conta com Google');
    } finally {
      setLocalLoading(false);
    }
  };
  
  if (showVerification) {
    return (
      <div className="min-h-screen flex flex-col pt-20 bg-eco-sand/30">
        <div className="container px-4 py-8 flex flex-col items-center">
          <Link to="/" className="mb-8 flex items-center gap-2">
            <Leaf className="h-8 w-8 text-eco-green" />
            <span className="font-semibold text-xl text-eco-green-dark">Terra Verde Conectada</span>
          </Link>

          <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <EmailVerification 
                email={email} 
                onBack={() => navigate('/login')} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col pt-20 bg-eco-sand/30">
      <div className="container px-4 py-8 flex flex-col items-center">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <Leaf className="h-8 w-8 text-eco-green" />
          <span className="font-semibold text-xl text-eco-green-dark">Terra Verde Conectada</span>
        </Link>

        <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-eco-green-dark">Criar Conta</h1>
              <p className="text-muted-foreground mt-2">
                Junte-se à comunidade e contribua com o mapa ecológico
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <PasswordInput
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Crie uma senha"
                  showRequirements={true}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <PasswordInput
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua senha"
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-500 font-medium">{error}</div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-eco-green hover:bg-eco-green-dark"
                disabled={isLoading || localLoading || captchaLoading}
              >
                {isLoading || localLoading || captchaLoading ? 'Verificando...' : 'Cadastrar'}
                <UserPlus className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <div className="relative my-6">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                ou continue com
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={isLoading || localLoading || captchaLoading}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.3v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.08z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-eco-green-dark hover:underline font-medium">
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
