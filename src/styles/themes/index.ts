// Theme type definition
export type ThemeName = 'dark-cosmic' | 'cyber-neon';

// Theme configuration
export const themes: Record<ThemeName, string> = {
  'dark-cosmic': 'theme-dark-cosmic',
  'cyber-neon': 'theme-cyber-neon',
};

// Optional: Theme metadata
export const themeConfig = {
  'dark-cosmic': {
    name: 'Dark Cosmic',
    description: 'Dark theme with cosmic gradients',
    preview: '#000000', // Color for theme switcher
  },
  'cyber-neon': {
    name: 'Cyber Neon',
    description: 'Cyberpunk-inspired neon theme',
    preview: '#0f1729',
  },
};
