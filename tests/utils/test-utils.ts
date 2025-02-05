// Common test utilities and helpers
import { render } from '@testing-library/react';
import { UserContext } from '../../src/client/contexts/UserContext';

// Custom render function with providers
export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <UserContext.Provider value={{ user: { id: 1 } }}>
      {ui}
    </UserContext.Provider>
  );
}