import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BotGameContextProvider } from '../BotGameContextProvider';

describe('BotGameContextProvider', () => {
  it('should render children without errors', () => {
    expect(() => {
      render(
        <BotGameContextProvider>
          <div data-testid="child">Child content</div>
        </BotGameContextProvider>
      );
    }).not.toThrow();

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
