import '@testing-library/jest-dom';

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
