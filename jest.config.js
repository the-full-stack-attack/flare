module.exports = {
  testEnvironment: 'jsdom', // Needed for testing React components
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  // jest.config.js
  setupFilesAfterEnv: ['./jest.setup.ts'],
  // Other Jest configuration options...
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest', // Transforms TypeScript files
    '^.+\\.(js|jsx)$': 'babel-jest', // Transforms JavaScript files
  },
  projects: [
    './tests/server',
  ],

};
