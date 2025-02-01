import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeName } from '.';
import { themes } from '.';

// Import theme styles
import './dark-cosmic.css';
import './cyber-neon.css';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('dark-cosmic');

  useEffect(() => {
    // Remove all theme classes
    Object.values(themes).forEach((themeClass) =>
      document.body.classList.remove({ themeClass })
    );
    // Add new theme class
    document.body.classList.add(themes[theme]);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
