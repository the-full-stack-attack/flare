import '@testing-library/jest-dom';
// jest.setup.js
// we need to npm install @types/Text encoder for this to work. it is too close to presentation for this
// import { TextEncoder, TextDecoder } from 'text-encoding';

// global.TextEncoder = TextEncoder;
// global.TextDecoder = TextDecoder;
// Add type definitions for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      // Add types for Testing Library's custom matchers
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | string[] | number): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
    }
  }
}
