import { render } from '@testing-library/react';
import { GameContextProvider } from '../PlayerGameContextProvider';
import { usePlayerGameContext } from '../usePlayerGameContext';

describe('usePlayerGameContext', () => {
  it('should throw error when used outside provider', () => {
    const TestComponent = () => {
      usePlayerGameContext();
      return <div>Test</div>;
    };

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'usePlayerGameContext must be used within a PlayerGameContextProvider'
    );

    consoleSpy.mockRestore();
  });

  it('should return context when used within provider', () => {
    const TestComponent = () => {
      const context = usePlayerGameContext();
      expect(context.players).toBeTruthy();

      return <div>Test</div>;
    };

    expect(() => {
      render(
        <GameContextProvider>
          <TestComponent />
        </GameContextProvider>
      );
    }).not.toThrow();
  });
});
