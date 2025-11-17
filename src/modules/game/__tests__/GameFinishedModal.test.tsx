import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GameFinishedModal } from '../GameFinishedModal';

const mockWinner = {
  id: '1',
  name: 'Alice',
  score: 0,
  turns: [],
  isBot: false,
  isCurrentPlayer: false,
  isWinner: true,
};
const mockPlayers = [
  {
    id: '1',
    name: 'Alice',
    score: 0,
    turns: [],
    isBot: false,
    isCurrentPlayer: false,
    isWinner: true,
  },
  {
    id: '2',
    name: 'Bob',
    score: 150,
    turns: [],
    isBot: false,
    isCurrentPlayer: false,
    isWinner: false,
  },
  {
    id: '3',
    name: 'Charlie',
    score: 200,
    turns: [],
    isBot: false,
    isCurrentPlayer: false,
    isWinner: false,
  },
];

const mockOnStartAgain = jest.fn();
const mockOnConfigureNewGame = jest.fn();
const mockOnDeleteLastTurn = jest.fn();

describe('GameFinishedModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal when open', () => {
    render(
      <GameFinishedModal
        open={true}
        winner={mockWinner}
        players={mockPlayers}
        onStartAgain={mockOnStartAgain}
        onConfigureNewGame={mockOnConfigureNewGame}
        onDeleteLastTurn={mockOnDeleteLastTurn}
      />
    );

    expect(screen.getByText('🎉 Game Finished! 🎉')).toBeInTheDocument();
    expect(screen.getByText('Alice wins!')).toBeInTheDocument();
    expect(screen.getByText('Final score:')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(2);
  });

  it('displays all player scores', () => {
    render(
      <GameFinishedModal
        open={true}
        winner={mockWinner}
        players={mockPlayers}
        onStartAgain={mockOnStartAgain}
        onConfigureNewGame={mockOnConfigureNewGame}
        onDeleteLastTurn={mockOnDeleteLastTurn}
      />
    );

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.getAllByText('0')).toHaveLength(2); // Winner score and final score
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
  });

  it('highlights the winner', () => {
    render(
      <GameFinishedModal
        open={true}
        winner={mockWinner}
        players={mockPlayers}
        onStartAgain={mockOnStartAgain}
        onConfigureNewGame={mockOnConfigureNewGame}
        onDeleteLastTurn={mockOnDeleteLastTurn}
      />
    );

    // The winner's score should be highlighted (check for primary color class)
    const winnerScores = screen.getAllByText('0');
    const winnerScore = winnerScores[1]; // The second 0 is the winner's score in the list
    expect(winnerScore).toHaveClass('text-primary');
  });

  it('calls onStartAgain when Start Again button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GameFinishedModal
        open={true}
        winner={mockWinner}
        players={mockPlayers}
        onStartAgain={mockOnStartAgain}
        onConfigureNewGame={mockOnConfigureNewGame}
        onDeleteLastTurn={mockOnDeleteLastTurn}
      />
    );

    const startAgainButton = screen.getByRole('button', {
      name: /start again/i,
    });
    await user.click(startAgainButton);

    expect(mockOnStartAgain).toHaveBeenCalledTimes(1);
  });

  it('calls onConfigureNewGame when Configure Game button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GameFinishedModal
        open={true}
        winner={mockWinner}
        players={mockPlayers}
        onStartAgain={mockOnStartAgain}
        onConfigureNewGame={mockOnConfigureNewGame}
        onDeleteLastTurn={mockOnDeleteLastTurn}
      />
    );

    const configureButton = screen.getByRole('button', {
      name: /configure game/i,
    });
    await user.click(configureButton);

    expect(mockOnConfigureNewGame).toHaveBeenCalledTimes(1);
  });

  it('calls onDeleteLastTurn with winner id when undo button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GameFinishedModal
        open={true}
        winner={mockWinner}
        players={mockPlayers}
        onStartAgain={mockOnStartAgain}
        onConfigureNewGame={mockOnConfigureNewGame}
        onDeleteLastTurn={mockOnDeleteLastTurn}
      />
    );

    const undoButton = screen.getByRole('button', {
      name: /delete last turn/i,
    });
    await user.click(undoButton);

    expect(mockOnDeleteLastTurn).toHaveBeenCalledWith('1');
  });
});
