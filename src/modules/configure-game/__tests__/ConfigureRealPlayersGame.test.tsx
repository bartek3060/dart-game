import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfigureRealPlayersGame from '../ConfigureRealPlayersGame';

// Mock hooks
const mockNavigateToGameplay = jest.fn();
jest.mock('@/hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigateToGameplay: mockNavigateToGameplay,
  }),
}));

const mockAddPlayerInput = jest.fn();
const mockRemovePlayerInput = jest.fn();
const mockStartRealPlayersGame = jest.fn();
const mockSetPlayerName = jest.fn();
const mockPlayers = [
  {
    id: '1',
    name: 'Player 1',
    score: 501,
    turns: [],
    isBot: false,
    isCurrentPlayer: false,
    isWinner: false,
  },
  {
    id: '2',
    name: 'Player 2',
    score: 501,
    turns: [],
    isBot: false,
    isCurrentPlayer: false,
    isWinner: false,
  },
];

jest.mock('@/contexts/PlayerGameContext/usePlayerGameContext', () => ({
  usePlayerGameContext: () => ({
    players: mockPlayers,
    addPlayerInput: mockAddPlayerInput,
    removePlayerInput: mockRemovePlayerInput,
    startRealPlayersGame: mockStartRealPlayersGame,
    setPlayerName: mockSetPlayerName,
  }),
}));

describe('ConfigureRealPlayersGame', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the configuration form', () => {
    render(<ConfigureRealPlayersGame />);

    expect(screen.getByText('Configure Real Players Game')).toBeInTheDocument();
    expect(screen.getByText('Enter Player Names')).toBeInTheDocument();
    expect(screen.getByText('Start Game')).toBeInTheDocument();
  });

  it('displays player input fields', () => {
    render(<ConfigureRealPlayersGame />);

    expect(screen.getByLabelText('Player 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Player 2')).toBeInTheDocument();
  });

  it('shows game rules', () => {
    render(<ConfigureRealPlayersGame />);

    expect(screen.getByText('Game Rules')).toBeInTheDocument();
    expect(screen.getByText('501 points')).toBeInTheDocument();
  });

  it('calls setPlayerName when input changes', async () => {
    const user = userEvent.setup();
    render(<ConfigureRealPlayersGame />);

    const player1Input = screen.getByLabelText('Player 1');
    await user.clear(player1Input);

    expect(mockSetPlayerName).toHaveBeenLastCalledWith('1', '');
  });

  it('calls addPlayerInput when Add Player button is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfigureRealPlayersGame />);

    const addButton = screen.getByRole('button', { name: /add player/i });
    await user.click(addButton);

    expect(mockAddPlayerInput).toHaveBeenCalledTimes(1);
  });

  it('calls startRealPlayersGame and navigateToGameplay when Start Game is clicked', async () => {
    const user = userEvent.setup();
    render(<ConfigureRealPlayersGame />);

    const startButton = screen.getByRole('button', { name: /start game/i });
    await user.click(startButton);

    expect(mockStartRealPlayersGame).toHaveBeenCalledTimes(1);
    expect(mockNavigateToGameplay).toHaveBeenCalledTimes(1);
  });

  it('shows minimum and maximum player limits', () => {
    render(<ConfigureRealPlayersGame />);

    expect(screen.getByText(/Maximum 6 players/)).toBeInTheDocument();
    expect(screen.getByText(/Minimum 2 players/)).toBeInTheDocument();
  });
});
