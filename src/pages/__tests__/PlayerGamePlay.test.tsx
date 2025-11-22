import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlayerGamePlay from '../PlayerGamePlay';
import { usePlayerGameContext } from '@/contexts/PlayerGameContext/usePlayerGameContext';
import { useNavigation } from '@/hooks/useNavigation';

jest.mock('@/contexts/PlayerGameContext/usePlayerGameContext');
jest.mock('@/hooks/useNavigation');
jest.mock('@/modules/game/GameFinishedModal', () => ({
    GameFinishedModal: () => <div data-testid="game-finished-modal">Game Finished Modal</div>,
}));

describe('PlayerGamePlay', () => {
    const mockNavigateToConfigureGame = jest.fn();
    const mockAddPlayerTurn = jest.fn();
    const mockDeleteLastPlayerTurn = jest.fn();
    const mockResetAndStartGame = jest.fn();

    const defaultContextValues = {
        players: [
            { id: 'p1', name: 'Player 1', score: 501, isCurrentPlayer: true, isBot: false, turns: [] },
            { id: 'p2', name: 'Player 2', score: 501, isCurrentPlayer: false, isBot: false, turns: [] },
        ],
        addPlayerTurn: mockAddPlayerTurn,
        deleteLastPlayerTurn: mockDeleteLastPlayerTurn,
        resetAndStartGame: mockResetAndStartGame,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({
            navigateToConfigureGame: mockNavigateToConfigureGame,
        });
        (usePlayerGameContext as jest.Mock).mockReturnValue(defaultContextValues);
    });

    it('redirects to configure game if no current player', () => {
        (usePlayerGameContext as jest.Mock).mockReturnValue({
            ...defaultContextValues,
            players: [], // No players
        });

        render(<PlayerGamePlay />);

        expect(mockNavigateToConfigureGame).toHaveBeenCalled();
    });

    it('renders player turn correctly', () => {
        render(<PlayerGamePlay />);

        expect(screen.getByText("Player 1's Turn")).toBeInTheDocument();
        expect(screen.getByText('Current Score')).toBeInTheDocument();
        expect(screen.getAllByText('501').length).toBeGreaterThan(0);
        expect(screen.getByPlaceholderText('Enter value 0-180')).toBeInTheDocument();
    });

    it('handles player input and submission', async () => {
        const user = userEvent.setup();
        render(<PlayerGamePlay />);

        const input = screen.getByPlaceholderText('Enter value 0-180');
        await user.type(input, '60');
        await user.keyboard('{Enter}');

        expect(mockAddPlayerTurn).toHaveBeenCalledWith('p1', 60);
    });

    it('validates invalid input', async () => {
        const user = userEvent.setup();
        render(<PlayerGamePlay />);

        const input = screen.getByPlaceholderText('Enter value 0-180');
        await user.type(input, '999');
        await user.keyboard('{Enter}');

        expect(mockAddPlayerTurn).not.toHaveBeenCalled();
    });

    it('renders game finished modal when there is a winner', () => {
        (usePlayerGameContext as jest.Mock).mockReturnValue({
            ...defaultContextValues,
            players: [
                { id: 'p1', name: 'Player 1', score: 0, isCurrentPlayer: true, isBot: false, turns: [] }, // Winner
                { id: 'p2', name: 'Player 2', score: 501, isCurrentPlayer: false, isBot: false, turns: [] },
            ],
        });

        render(<PlayerGamePlay />);

        expect(screen.getByTestId('game-finished-modal')).toBeInTheDocument();
    });

    it('allows undoing the last turn', async () => {
        const user = userEvent.setup();
        (usePlayerGameContext as jest.Mock).mockReturnValue({
            ...defaultContextValues,
            players: [
                { id: 'p1', name: 'Player 1', score: 441, isCurrentPlayer: false, isBot: false, turns: [60] },
                { id: 'p2', name: 'Player 2', score: 501, isCurrentPlayer: true, isBot: false, turns: [] },
            ],
        });

        render(<PlayerGamePlay />);

        const undoButton = screen.getByTestId('undo-icon');
        await user.click(undoButton);

        expect(mockDeleteLastPlayerTurn).toHaveBeenCalledWith('p1');
    });
});
