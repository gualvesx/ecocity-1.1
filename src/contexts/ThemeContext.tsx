
import * as React from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  colorblindMode: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleColorblindMode: () => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ 
  children: React.ReactNode; 
  defaultTheme?: 'light' | 'dark';
  storageKey?: string;
}> = ({ 
  children, 
  defaultTheme = 'light',
  storageKey = 'vite-ui-theme'
}) => {
  const [theme, setTheme] = React.useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as 'light' | 'dark') || defaultTheme;
    }
    return defaultTheme;
  });

  const [colorblindMode, setColorblindMode] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('colorblind-mode') === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    if (colorblindMode) {
      root.classList.add('colorblind');
    } else {
      root.classList.remove('colorblind');
    }
    
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  React.useEffect(() => {
    const root = window.document.documentElement;
    if (colorblindMode) {
      root.classList.add('colorblind');
    } else {
      root.classList.remove('colorblind');
    }
    localStorage.setItem('colorblind-mode', colorblindMode.toString());
  }, [colorblindMode]);

  const toggleColorblindMode = () => {
    setColorblindMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorblindMode, setTheme, toggleColorblindMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = React.useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
