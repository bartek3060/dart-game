import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BotGameContextProvider } from '../BotGameContextProvider';
import { useBotGameContext } from '../BotGameContext';

describe('useBotGameContext', () => {
  it('should throw error when used outside provider', () => {
    const TestComponent = () => {
      useBotGameContext();
      return <div>Test</div>;
    };

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useBotGameContext must be used within BotGameContextProvider');

    consoleSpy.mockRestore();
  });

  it('should return context when used within provider', () => {
    const TestComponent = () => {
      const context = useBotGameContext();
      expect(context.players).toBeTruthy();

      return <div>Test</div>;
    };

    expect(() => {
      render(
        <BotGameContextProvider>
          <TestComponent />
        </BotGameContextProvider>
      );
    }).not.toThrow();
  });
});
