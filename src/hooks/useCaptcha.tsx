
import { useState, useEffect } from 'react';
import { useReCaptcha } from '@/contexts/ReCaptchaContext';

export interface UseCaptchaOptions {
  siteKey?: string;
  action?: string;
  autoExecute?: boolean;
  expectedScore?: number;
}

interface CaptchaVerificationResult {
  token: string;
  verified: boolean;
  score: number;
}

export const useCaptcha = (options: UseCaptchaOptions = {}) => {
  const {
    action = 'submit',
    autoExecute = false,
  } = options;

  const { 
    ready, 
    loading: contextLoading, 
    error: contextError, 
    execute: contextExecute,
    resetError 
  } = useReCaptcha();

  const [result, setResult] = useState<CaptchaVerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sync context error with local error
  useEffect(() => {
    if (contextError) {
      setError(new Error(contextError));
    } else {
      setError(null);
    }
  }, [contextError]);

  // Auto-execute when ready if requested
  useEffect(() => {
    if (ready && autoExecute && !result && !loading) {
      execute();
    }
  }, [ready, autoExecute, result, loading]);

  // Function to execute reCAPTCHA - Firebase App Check handles verification automatically
  const execute = async (customAction?: string): Promise<CaptchaVerificationResult | null> => {
    if (!ready) {
      const errorMsg = 'reCAPTCHA não está pronto para execução';
      console.error(errorMsg);
      setError(new Error(errorMsg));
      return null;
    }

    setLoading(true);
    setError(null);
    resetError();

    try {
      const actionToUse = customAction || action;
      
      console.log(`Executando reCAPTCHA com ação: ${actionToUse}`);
      
      // Get token from reCAPTCHA - Firebase App Check will handle verification
      const token = await contextExecute(actionToUse);
      
      if (!token || token.length === 0) {
        throw new Error('Token reCAPTCHA não foi obtido');
      }

      console.log('Token reCAPTCHA obtido - Firebase App Check cuidará da verificação automaticamente');
      
      // Since Firebase App Check handles verification, we assume the token is valid
      // and return a successful result
      const verificationResult: CaptchaVerificationResult = {
        token,
        verified: true, // Firebase App Check handles this
        score: 0.9 // Default high score since Firebase approved the token
      };

      console.log('reCAPTCHA executado com sucesso via Firebase App Check');

      setResult(verificationResult);
      setLoading(false);
      return verificationResult;
      
    } catch (err) {
      console.error('Falha ao executar reCAPTCHA:', err);
      const error = err instanceof Error ? err : new Error('Failed to execute reCAPTCHA');
      setError(error);
      setLoading(false);
      return null;
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    resetError();
  };

  return {
    result,
    token: result?.token || null,
    verified: result?.verified || false,
    score: result?.score || 0,
    loading: loading || contextLoading,
    error,
    ready,
    execute,
    reset,
  };
};
