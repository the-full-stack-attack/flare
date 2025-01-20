module.exports = {
  // The environments the code will run in
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    "plugin:react/recommended",
    // Add prettier if you are using it
  ],
  // Specify parser to use for typescript code
  parser: '@typescript-eslint/parser',
  // Configure the parser
  parserOptions: {
    ecmaFeatures: {
      // Enable jsx syntax checking
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json', // Path to your tsconfig.json file
  },
  plugins: [
      'react',
      // Enforce react hooks rules
      'react-hooks',
      // Checks for accessibility issues in jsx
      'jsx-a11y',
      '@typescript-eslint',
    ],
  rules: {
    // Add any custom rules here
    "react/prop-types/": 'off', // turn off prop types since we're using Typescript
  },
  // Ignore files in the test directory
  ignorePatterns: ['tests/*',]
};

