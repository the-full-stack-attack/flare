import '@testing-library/jest-dom';

// Add type definitions for custom matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      // Add types for Testing Library's custom matchers
      toBeInTheDocument(): R;
      toHaveStyle(style: Record<string, any>): R;
      // Add more custom matcher types as needed
    }
  }
}
