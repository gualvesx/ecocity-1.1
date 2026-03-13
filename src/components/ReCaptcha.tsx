
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { useReCaptcha } from '@/contexts/ReCaptchaContext';

interface ReCaptchaProps {
  siteKey?: string;
  onChange: (token: string | null) => void;
  action?: string;
  onError?: (error: string) => void;
}

interface ReCaptchaRefHandle {
  execute: () => Promise<string | null>;
  reset: () => void;
}

export const ReCaptcha = forwardRef<ReCaptchaRefHandle, ReCaptchaProps>(
  ({ onChange, action = 'submit', onError }, ref) => {
    const { ready, loading, error, execute: contextExecute, resetError } = useReCaptcha();
    const [lastToken, setLastToken] = useState<string | null>(null);

    // Handle errors from context
    useEffect(() => {
      if (error && onError) {
        onError(error);
      }
    }, [error, onError]);

    // Method to execute reCAPTCHA
    const execute = async (): Promise<string | null> => {
      try {
        resetError();
        console.log(`Executando reCAPTCHA v3 com ação: ${action}`);
        const token = await contextExecute(action);
        
        if (token) {
          setLastToken(token);
          onChange(token);
          console.log('Token reCAPTCHA v3 obtido no componente:', token.substring(0, 20) + '...');
          return token;
        } else {
          onChange(null);
          console.log('Nenhum token reCAPTCHA v3 obtido');
          return null;
        }
      } catch (err) {
        console.error('Erro ao executar reCAPTCHA v3:', err);
        onChange(null);
        if (onError) {
          onError(`Erro ao executar reCAPTCHA v3: ${err}`);
        }
        return null;
      }
    };

    const reset = () => {
      setLastToken(null);
      resetError();
      onChange(null);
    };

    // Expose methods via ref
    React.useImperativeHandle(
      ref,
      () => ({
        execute,
        reset
      })
    );

    return (
      <div className="recaptcha-container">
        {loading && (
          <p className="text-xs text-blue-500">
            Carregando reCAPTCHA v3...
          </p>
        )}
        {ready && !error && (
          <p className="text-xs text-green-500">
            ✓ reCAPTCHA v3 pronto
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500">
            ⚠ Erro reCAPTCHA v3: {error}
          </p>
        )}
        {lastToken && (
          <p className="text-xs text-gray-500">
            Token obtido: {lastToken.substring(0, 20)}...
          </p>
        )}
      </div>
    );
  }
);

ReCaptcha.displayName = 'ReCaptcha';

// Hook para uso mais fácil do reCAPTCHA
export const useReCaptchaComponent = (action: string = 'submit') => {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const captchaRef = useRef<ReCaptchaRefHandle>(null);

  const execute = async () => {
    if (captchaRef.current) {
      const newToken = await captchaRef.current.execute();
      setToken(newToken);
      return newToken;
    }
    return null;
  };

  const reset = () => {
    if (captchaRef.current) {
      captchaRef.current.reset();
    }
    setToken(null);
    setError(null);
  };

  const CaptchaComponent = () => (
    <ReCaptcha
      ref={captchaRef}
      onChange={setToken}
      onError={setError}
      action={action}
    />
  );

  return { 
    token, 
    error, 
    execute, 
    reset, 
    CaptchaComponent 
  };
};

export default ReCaptcha;
