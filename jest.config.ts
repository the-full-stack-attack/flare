import type { Config } from 'jest';

const config: Config = {
  // Tells Jest to use ts-jest for TypeScript files
  preset: 'ts-jest/presets/default-esm',
  // Test Env for browser-like globals
  testEnvironment: 'jsdom',
  // Files to run before test - sets up testing environment
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

  // How to handle different file types when importing
  moduleNameMapper: {
    '^.+\\.(css)$': 'identity-obj-proxy',
    // Converts image imports to a mock file
    '^.+\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/tests/__mocks__/fileMock.ts',
    // Handle path aliases if used in tsconfig
    '^@/(.*)$': '<rootDir>/src/$1'
  },
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
transformIgnorePatterns: ['/node_modules/(?!(lucide-react)/)'],
automock: false,
clearMocks: true,
collectCoverage: false,
coverageDirectory: 'coverage',
coveragePathIgnorePatterns: [
  '/node_modules',
  '/tests',
  ],

  // Pattern for finding test files
  testMatch: [
    '**/tests/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};

export default config;
