import { render, screen } from '@testing-library/react';
import { GameContextProvider } from '../PlayerGameContextProvider';

describe('GameContextProvider', () => {
  it('should render children without errors', () => {
    expect(() => {
      render(
        <GameContextProvider>
          <div data-testid="child">Child content</div>
        </GameContextProvider>
      );
    }).not.toThrow();

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
