/**
 * This file tests:
 *  - the NavBar component to ensure it renders the Events link
 *  - renders the Flare logo
 * We use Jest & @testing-library/react.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import NavBar from '../../src/client/components/NavBar'

describe('NavBar Component', () => {
  it('renders the Flare logo', () => {
    render(<NavBar />);
    const logoElement = screen.getByText(/flare/i);
      expect(logoElement).toBeInTheDocument();
      });

  it('renders "Events" link in the navbar', () => {
        render(<NavBar />);

        const eventsLink = screen.getByText(/events/i);
    expect(eventsLink).toBeInTheDocument();
  });
});
