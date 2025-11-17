import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GamePlay from '../GamePlay';

// Mock hooks
const mockNavigateToConfigureGame = jest.fn();
jest.mock('@/hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigateToConfigureGame: mockNavigateToConfigureGame,
  }),
}));

const mockAddPlayerTurn = jest.fn();
const mockDeleteLastPlayerTurn = jest.fn();
const mockResetAndStartGame = jest.fn();
const mockPlayers = [
  { id: '1', name: 'Player 1', score: 501, isCurrentPlayer: true },
  { id: '2', name: 'Player 2', score: 450, isCurrentPlayer: false },
];
jest.mock('@/contexts/PlayerGameContext/usePlayerGameContext', () => ({
  usePlayerGameContext: () => ({
    players: mockPlayers,
    addPlayerTurn: mockAddPlayerTurn,
    deleteLastPlayerTurn: mockDeleteLastPlayerTurn,
    resetAndStartGame: mockResetAndStartGame,
  }),
}));

// Mock child components
jest.mock('@/modules/game/Keyboard', () => ({
  Keyboard: ({
    onKeyPress,
    onBackspace,
    onEnter,
  }: {
    onKeyPress: (digit: string) => void;
    onBackspace: () => void;
    onEnter: () => void;
  }) => (
    <div data-testid="keyboard">
      <button onClick={() => onKeyPress('1')}>1</button>
      <button onClick={onBackspace}>Backspace</button>
      <button onClick={onEnter}>Enter</button>
    </div>
  ),
}));

jest.mock('@/modules/game/GameFinishedModal', () => ({
  GameFinishedModal: () => (
    <div data-testid="game-finished-modal">Game Finished</div>
  ),
}));

describe('GamePlay', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the game play page', () => {
    render(<GamePlay />);

    expect(screen.getByText('Dart Game - 501')).toBeInTheDocument();
    expect(
      screen.getByText('Points countdown from 501 to 0')
    ).toBeInTheDocument();
    expect(screen.getByText('Players Scores')).toBeInTheDocument();
    expect(screen.getByText("Player 1's Turn")).toBeInTheDocument();
  });

  it('displays player scores', () => {
    render(<GamePlay />);

    expect(screen.getByText('Player 1')).toBeInTheDocument();
    expect(screen.getAllByText('501')).toHaveLength(2); // One in tab, one in current score
    expect(screen.getByText('Player 2')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
  });

  it('handles input and submit turn', async () => {
    const user = userEvent.setup();
    render(<GamePlay />);

    const input = screen.getByPlaceholderText('Enter value 0-180');
    await user.type(input, '50');
    await user.keyboard('{Enter}');

    expect(mockAddPlayerTurn).toHaveBeenCalledWith('1', 50);
  });

  it('handles keyboard input', async () => {
    const user = userEvent.setup();
    render(<GamePlay />);

    const keyboardButton = screen.getByText('1');
    await user.click(keyboardButton);

    const input = screen.getByPlaceholderText('Enter value 0-180');
    expect(input).toHaveValue(1);
  });

  it('handles backspace', async () => {
    const user = userEvent.setup();
    render(<GamePlay />);

    const input = screen.getByPlaceholderText('Enter value 0-180');
    await user.type(input, '12');
    expect(input).toHaveValue(12);

    const backspaceButton = screen.getByText('Backspace');
    await user.click(backspaceButton);
    expect(input).toHaveValue(1);
  });
});
