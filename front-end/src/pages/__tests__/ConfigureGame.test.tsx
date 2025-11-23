import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigureGame from '../ConfigureGame';

// Mock hooks
const mockNavigate = jest.fn();
jest.mock('@/hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
  }),
}));

// Mock child components
jest.mock('../../modules/configure-game/ConfigureRealPlayersGame', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="configure-real-players">Configure Real Players</div>
  ),
}));

jest.mock('../../modules/configure-game/ConfigureBotGame', () => ({
  __esModule: true,
  default: () => <div data-testid="configure-bot-game">Configure Bot Game</div>,
}));

jest.mock('../../modules/configure-game/GameModeSelector', () => ({
  __esModule: true,
  default: ({
    gameMode,
    onGameModeChange,
  }: {
    gameMode: string;
    onGameModeChange: (mode: string) => void;
  }) => (
    <div data-testid="game-mode-selector">
      <button onClick={() => onGameModeChange('real-players')}>
        Real Players
      </button>
      <button onClick={() => onGameModeChange('bot')}>Play vs Bot</button>
      <span>Current mode: {gameMode}</span>
    </div>
  ),
}));

describe('ConfigureGame', () => {
  it('renders the game configuration page', () => {
    render(<ConfigureGame />);

    expect(screen.getByText('Dart Game Configuration')).toBeInTheDocument();
    expect(screen.getByText(/Select your game mode/)).toBeInTheDocument();
    expect(screen.getByTestId('game-mode-selector')).toBeInTheDocument();
  });

  it('renders ConfigureRealPlayersGame by default', () => {
    render(<ConfigureGame />);

    expect(screen.getByTestId('configure-real-players')).toBeInTheDocument();
  });

  it('changes game mode when selector changes', async () => {
    const user = userEvent.setup();
    render(<ConfigureGame />);

    // Initially real-players
    expect(screen.getByText('Current mode: real-players')).toBeInTheDocument();

    // Click bot button
    await user.click(screen.getByText('Play vs Bot'));

    // Should show Configure Bot Game for bot mode
    expect(screen.getByText('Configure Bot Game')).toBeInTheDocument();
    expect(
      screen.queryByTestId('configure-real-players')
    ).not.toBeInTheDocument();
  });
});
