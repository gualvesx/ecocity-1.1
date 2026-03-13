
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ReCaptchaContextProps {
  siteKey: string;
  ready: boolean;
  loading: boolean;
  error: string | null;
  execute: (action?: string) => Promise<string | null>;
  resetError: () => void;
}

const ReCaptchaContext = createContext<ReCaptchaContextProps | undefined>(undefined);

// Chave correta do reCAPTCHA Enterprise
const DEFAULT_SITE_KEY = '6LebLEIrAAAAAB_aVSPikogiQ6GXa4DuWl-4VMVj';

interface ReCaptchaProviderProps {
  siteKey?: string;
  children: React.ReactNode;
}

export const ReCaptchaProvider: React.FC<ReCaptchaProviderProps> = ({ 
  siteKey = DEFAULT_SITE_KEY,
  children 
}) => {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for reCAPTCHA availability
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 20;
    
    const checkReCaptcha = () => {
      try {
        setLoading(true);
        setError(null);
        
        // Check if grecaptcha enterprise is available
        if (typeof window !== 'undefined' && 
            window.grecaptcha?.enterprise?.ready) {
          console.log('reCAPTCHA Enterprise detectado, inicializando...');
          window.grecaptcha.enterprise.ready(() => {
            setReady(true);
            setLoading(false);
            console.log('reCAPTCHA Enterprise inicializado com sucesso');
            
            // Hide reCAPTCHA badge on mobile for better UX
            const style = document.createElement('style');
            style.innerHTML = `
              @media (max-width: 768px) {
                .grecaptcha-badge {
                  visibility: hidden !important;
                  opacity: 0 !important;
                  transform: scale(0) !important;
                  transition: all 0.3s ease !important;
                }
              }
            `;
            document.head.appendChild(style);
          });
        } else if (typeof window !== 'undefined' && 
                   window.grecaptcha?.ready) {
          // Fallback para reCAPTCHA v3 normal
          console.log('reCAPTCHA v3 detectado, inicializando...');
          window.grecaptcha.ready(() => {
            setReady(true);
            setLoading(false);
            console.log('reCAPTCHA v3 inicializado com sucesso');
            
            // Hide reCAPTCHA badge on mobile for better UX
            const style = document.createElement('style');
            style.innerHTML = `
              @media (max-width: 768px) {
                .grecaptcha-badge {
                  visibility: hidden !important;
                  opacity: 0 !important;
                  transform: scale(0) !important;
                  transition: all 0.3s ease !important;
                }
              }
            `;
            document.head.appendChild(style);
          });
        } else {
          // reCAPTCHA not loaded yet, retry
          retryCount++;
          if (retryCount < maxRetries) {
            console.log(`reCAPTCHA não encontrado, tentativa ${retryCount}/${maxRetries}`);
            setTimeout(checkReCaptcha, 500);
          } else {
            console.error('reCAPTCHA não foi carregado após múltiplas tentativas');
            setError('reCAPTCHA não foi carregado');
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Erro ao verificar reCAPTCHA:', err);
        setError('Erro ao verificar reCAPTCHA');
        setLoading(false);
      }
    };

    // Start checking after a brief delay to ensure scripts load
    setTimeout(checkReCaptcha, 100);
  }, []);

  // Function to execute reCAPTCHA
  const execute = async (action = 'submit'): Promise<string | null> => {
    if (!ready) {
      const errorMsg = 'reCAPTCHA não está pronto';
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }

    if (typeof window === 'undefined' || !window.grecaptcha) {
      const errorMsg = 'reCAPTCHA não está disponível';
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }

    try {
      console.log(`Executando reCAPTCHA Enterprise com ação: ${action} e chave: ${siteKey}`);
      
      let token: string;
      
      // Tentar usar reCAPTCHA Enterprise primeiro
      if (window.grecaptcha.enterprise?.execute) {
        token = await window.grecaptcha.enterprise.execute(siteKey, { action });
      } else if (window.grecaptcha.execute) {
        // Fallback para reCAPTCHA v3 normal
        token = await window.grecaptcha.execute(siteKey, { action });
      } else {
        throw new Error('Método de execução reCAPTCHA não encontrado');
      }
      
      if (token && token.length > 0) {
        console.log('Token reCAPTCHA obtido com sucesso:', token.substring(0, 20) + '...');
        setError(null);
        return token;
      } else {
        throw new Error('Token reCAPTCHA vazio ou inválido');
      }
    } catch (err) {
      const errorMsg = `Erro ao executar reCAPTCHA: ${err}`;
      console.error(errorMsg);
      setError(errorMsg);
      return null;
    }
  };

  const resetError = () => {
    setError(null);
  };

  const value = {
    siteKey,
    ready,
    loading,
    error,
    execute,
    resetError,
  };

  return (
    <ReCaptchaContext.Provider value={value}>
      {children}
    </ReCaptchaContext.Provider>
  );
};

export const useReCaptcha = () => {
  const context = useContext(ReCaptchaContext);
  
  if (context === undefined) {
    throw new Error('useReCaptcha must be used within a ReCaptchaProvider');
  }
  
  return context;
};
