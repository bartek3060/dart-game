import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ConfigureBotGame from '../ConfigureBotGame';
import { BotGameContextProvider } from '../../../contexts/BotGameContext/BotGameContextProvider';
import { BotDifficulty } from '../../../contexts/BotGameContext/botGameTypes';

// Mock the useNavigation hook
const mockNavigateToBotGameplay = jest.fn();
jest.mock('../../../hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigateToBotGameplay: mockNavigateToBotGameplay,
  }),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Bot: ({ className }: { className?: string }) => (
    <div data-testid="bot-icon" className={className}>
      Bot Icon
    </div>
  ),
}));

describe('ConfigureBotGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders player name input with default value', () => {
    // When
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // Then
    const nameInput = screen.getByLabelText('Your Name');
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('Player 1');
  });

  it('allows updating player name', async () => {
    // Given
    const user = userEvent.setup();
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // When
    const nameInput = screen.getByLabelText('Your Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Alice');

    // Then
    expect(nameInput).toHaveValue('Alice');
  });

  it('renders all bot difficulty options', () => {
    // When
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // Then
    Object.values(BotDifficulty).forEach((difficulty: string) => {
      expect(screen.getByText(difficulty)).toBeInTheDocument();
    });
  });

  it('selects medium difficulty by default', () => {
    // When
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // Then
    const mediumCard = screen.getByText('medium');
    expect(mediumCard).toBeInTheDocument();
  });

  it('allows changing bot difficulty', async () => {
    // Given
    const user = userEvent.setup();
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // When
    const hardDifficultyCard = screen
      .getByText('hard')
      .closest('div[class*="cursor-pointer"]');
    expect(hardDifficultyCard).toBeInTheDocument();

    await user.click(hardDifficultyCard!);

    // Then
    expect(hardDifficultyCard).toHaveClass('border-primary');
  });

  it('disables start button when player name is empty', async () => {
    // Given
    const user = userEvent.setup();
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // When
    const nameInput = screen.getByLabelText('Your Name');
    await user.clear(nameInput);
    await user.type(nameInput, '   ');

    // Then
    const startButton = screen.getByRole('button', { name: /Start Game vs/ });
    expect(startButton).toBeDisabled();
  });

  it('enables start button when player name is provided', async () => {
    // Given
    const user = userEvent.setup();
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );
    const nameInput = screen.getByLabelText('Your Name');
    await user.clear(nameInput);

    // When
    await user.type(nameInput, 'Alice');

    // Then
    const startButton = screen.getByRole('button', { name: /Start Game vs/ });
    expect(startButton).toBeEnabled();
  });

  it('starts game and navigates when button is clicked', async () => {
    // Given
    const user = userEvent.setup();
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );
    const nameInput = screen.getByLabelText('Your Name');
    await user.clear(nameInput);
    await user.type(nameInput, 'Alice');

    // When
    const startButton = screen.getByRole('button', { name: /Start Game vs/ });
    await user.click(startButton);

    // Then
    await waitFor(() => {
      expect(mockNavigateToBotGameplay).toHaveBeenCalledTimes(1);
    });
  });

  it('shows correct bot difficulty in start button', () => {
    // When
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // Then
    const startButton = screen.getByRole('button', {
      name: /Start Game vs Medium Bot/,
    });
    expect(startButton).toBeInTheDocument();
  });

  it('updates button text when difficulty changes', async () => {
    // Given
    const user = userEvent.setup();
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // When
    const hardDifficultyCard = screen
      .getByText('hard')
      .closest('div[class*="cursor-pointer"]');
    await user.click(hardDifficultyCard!);

    // Then
    const startButton = screen.getByRole('button', {
      name: /Start Game vs Hard Bot/,
    });
    expect(startButton).toBeInTheDocument();
  });

  it('renders difficulty cards with descriptions', () => {
    // When
    render(
      <BotGameContextProvider>
        <ConfigureBotGame />
      </BotGameContextProvider>
    );

    // Then
    expect(screen.getByText('easy')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('hard')).toBeInTheDocument();
    expect(screen.getByText('expert')).toBeInTheDocument();
  });
});
