import type { Config } from 'jest';

const config: Config = {
  // Tells Jest to use ts-jest for TypeScript files
  preset: 'ts-jest',

  // Test Env for browser-like globals
  testEnvironment: 'jsdom',

  // How to handle different file types when importing
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'identity-obj-proxy',

    // Converts image imports to a mock file
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rotDir>/__mocks__/fileMock.ts',

    // Handle path aliases if used in tsconfig
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  // Files to run before test - sets up testing environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ys'],

  // Patterns to ignore when looking for test files
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/'
  ],

  // How to transform different file types
  transform: {
    // Transform TypeScript files using ts-jest
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.jest.json'
    }]
},

automock: false,
clearMocks: true,
collectCoverage: true,
coverageDirectory: 'coverage',
coveragePathIgnorePatterns: [
  '/node_modules',
  '/__tests__',
  ],

  // Pattern for finding test files
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ]
};

export default config;
