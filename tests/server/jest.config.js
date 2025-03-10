module.exports = {
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|webp|svg)$': './__mocks__/fileMock.js',
  },
  preset: 'ts-jest',
  globalSetup: './setup.ts',
  globalTeardown: './teardown.ts',
};