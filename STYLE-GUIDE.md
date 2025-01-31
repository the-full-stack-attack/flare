# 🎨 Flare Styling System Documentation

## Table of Contents

- [🎨 Flare Styling System Documentation](#-flare-styling-system-documentation)
  - [Table of Contents](#table-of-contents)
  - [📁 Structure](#-structure)
  - [📥 Import Convention](#-import-convention)
  - [🎭 Available Theme Classes (WIP)](#-available-theme-classes-wip)
    - [🌌 Dark Cosmic Theme](#-dark-cosmic-theme)
    - [🌆 Cyber Neon Theme](#-cyber-neon-theme)
  - [🧩 Common Components](#-common-components)
    - [🃏 Cards](#-cards)
    - [📦 Containers](#-containers)
    - [📝 Typography](#-typography)
  - [🎨 Using Themes in Components](#-using-themes-in-components)
  - [🛠 Utility Classes](#-utility-classes)
    - [📐 Layout](#-layout)
    - [✨ Animations](#-animations)
  - [⭐️ Best Practices](#️-best-practices)
  - [🔄 Migration Guide](#-migration-guide)
  - [❓ Questions \& Support](#-questions--support)
  - [🤝 Contributing](#-contributing)

## 📁 Structure

```bash
src/
├── styles/
│   ├── main.css          # Global styles and utilities
│   └── themes/
│       ├── dark-cosmic.css
│       ├── cyber-neon.css
│       └── index.ts       # Theme exports and types
```

## 📥 Import Convention

Use the  `@`  alias for all style imports:

```
// Correct way to import styles
import '@/styles/main.css';
import '@/styles/themes/dark-cosmic.css';
import '@/styles/themes/cyber-neon.css';
```

## 🎭 Available Theme Classes (WIP)

### 🌌 Dark Cosmic Theme

```
.theme-dark-cosmic {
  /* Base gradients */
  .bg-gradient-dark {
    @apply bg-gradient-to-br from-black via-gray-900 to-pink-900;
  }

  /* Cards */
  .glass-card {
    @apply backdrop-blur-lg bg-white/10 rounded-xl border border-white/10;
  }

  /* Typography */
  .text-gradient {
    @apply bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-500 bg-clip-text text-transparent;
  }
}
```

### 🌆 Cyber Neon Theme

```
.theme-cyber-neon {
  /* Base gradients */
  .bg-gradient-dark {
    @apply bg-gradient-to-br from-blue-900 via-purple-900 to-cyan-900;
  }

  /* Cards */
  .glass-card {
    @apply backdrop-blur-lg bg-blue-500/10 rounded-xl border border-cyan-500/30;
  }

  /* Typography */
  .text-gradient {
    @apply bg-gradient-to-r from-cyan-400 via-green-400 to-yellow-400 bg-clip-text text-transparent;
  }
}
```

## 🧩 Common Components

### 🃏 Cards

```
// Glass Card Example
<div className="glass-card p-6 hover:bg-white/20 transition-all">
  <h2 className="text-gradient">Card Title</h2>
  {/* Card content */}
</div>
```

### 📦 Containers

```
// Page Container
<div className="page-container">
  <div className="content-container">
    {/* Page content */}
  </div>
</div>
```

### 📝 Typography

```
// Gradient Text
<h1 className="text-gradient text-4xl font-bold">
  Hello World
</h1>

// Headings
<h2 className="heading-large">Large Heading</h2>
<h3 className="heading-medium">Medium Heading</h3>
```

## 🎨 Using Themes in Components

1. Basic Usage:

```
import '@/styles/themes/dark-cosmic.css';

function MyComponent() {
  return (
    <div className="theme-dark-cosmic">
      <div className="glass-card">
        <h2 className="text-gradient">Title</h2>
      </div>
    </div>
  );
}
```

2. With Theme Switching:

```
import { useTheme } from '@/components/ThemeProvider';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div className={theme}>
      <select 
        value={theme} 
        onChange={(e) => setTheme(e.target.value)}
      >
        <option value="theme-dark-cosmic">Dark Cosmic</option>
        <option value="theme-cyber-neon">Cyber Neon</option>
      </select>
      {/* Component content */}
    </div>
  );
}
```

## 🛠 Utility Classes

### 📐 Layout

```
.page-container {
  @apply min-h-screen relative overflow-hidden;
}

.content-container {
  @apply relative z-10 container mx-auto px-4;
}
```

### ✨ Animations

```
.hover-scale {
  @apply transition-transform duration-200 hover:scale-105;
}

.fade-in {
  @apply animate-[fadeIn_0.5s_ease-in-out];
}
```

## ⭐️ Best Practices

1. Always use the  `@`  alias for imports
2. Use theme classes at the highest possible level
3. Utilize utility classes for common patterns
4. Follow the established class naming convention
5. Keep component-specific styles minimal

## 🔄 Migration Guide

If you're updating existing components:

1. Update imports:

```
// From
import './styles/something.css';

// To
import '@/styles/main.css';
```

2. Update class usage:

```
// From
<div className="old-card">

// To
<div className="glass-card">
```

3. Add theme context:

```
// At app level
import { ThemeProvider } from '@/components/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      {/* App content */}
    </ThemeProvider>
  );
}
```

## ❓ Questions & Support

For questions about the styling system, please:

1. Check this documentation
2. Review the theme files directly
3. Contact the team lead
4. Create an issue with the "styling" label

## 🤝 Contributing

When adding new styles:

1. Follow the established pattern
2. Update this documentation
3. Test in both themes
4. Create a PR with before/after screenshots
