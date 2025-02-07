// Import required testing utilities
import React from 'react';
import { render, screen } from '@testing-library/react';

// Simple test component
const HelloWorld = () => <h1>Hello, World!</h1>;

// Test suite
describe('Sample Test', () => {
  // Individual test case
  it('renders hello world', () => {
    // Render the component
    render(<HelloWorld />);

    // Assert the text is in the document
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  // Add more basic tests to verify setup
  it('demonstrates different queries', () => {
    render(<HelloWorld />);

    // Test different query methods
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});



