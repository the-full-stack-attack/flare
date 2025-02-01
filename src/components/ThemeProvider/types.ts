import type { ThemeName } from '../../styles/themes';

export interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}
