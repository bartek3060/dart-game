import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BotGamePlay from '../BotGamePlay';
import { useBotGameContext } from '@/contexts/BotGameContext/BotGameContext';
import { useNavigation } from '@/hooks/useNavigation';
import { generateBotThrow } from '@/modules/game/generateBotThrows';

jest.mock('@/contexts/BotGameContext/BotGameContext');
jest.mock('@/hooks/useNavigation');
jest.mock('@/modules/game/generateBotThrows');
jest.mock('@/modules/game/GameFinishedModal', () => ({
    GameFinishedModal: () => <div data-testid="game-finished-modal">Game Finished Modal</div>,
}));

describe('BotGamePlay', () => {
    const mockNavigateToConfigureGame = jest.fn();
    const mockAddPlayerTurn = jest.fn();
    const mockAddBotTurn = jest.fn();
    const mockDeleteLastPlayerTurn = jest.fn();
    const mockResetAndStartGame = jest.fn();
    const mockSetLoading = jest.fn();

    const defaultContextValues = {
        players: [
            { id: 'p1', name: 'Player 1', score: 501, isCurrentPlayer: true, isBot: false, turns: [] },
            { id: 'b1', name: 'Bot', score: 501, isCurrentPlayer: false, isBot: true, turns: [] },
        ],
        botDifficulty: 'Medium',
        isLoading: false,
        addPlayerTurn: mockAddPlayerTurn,
        addBotTurn: mockAddBotTurn,
        deleteLastPlayerTurn: mockDeleteLastPlayerTurn,
        resetAndStartGame: mockResetAndStartGame,
        setLoading: mockSetLoading,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigation as jest.Mock).mockReturnValue({
            navigateToConfigureGame: mockNavigateToConfigureGame,
        });
        (useBotGameContext as jest.Mock).mockReturnValue(defaultContextValues);
        (generateBotThrow as jest.Mock).mockReturnValue(20);
    });

    it('redirects to configure game if no current player', () => {
        (useBotGameContext as jest.Mock).mockReturnValue({
            ...defaultContextValues,
            players: [],
        });

        render(<BotGamePlay />);

        expect(mockNavigateToConfigureGame).toHaveBeenCalled();
    });

    it('renders player turn correctly', () => {
        render(<BotGamePlay />);

        expect(screen.getByText("Player 1's Turn")).toBeInTheDocument();
        expect(screen.getByText('Current Score')).toBeInTheDocument();
        expect(screen.getAllByText('501').length).toBeGreaterThan(0);
        expect(screen.getByPlaceholderText('Enter value 0-180')).toBeInTheDocument();
    });

    it('handles player input and submission', async () => {
        const user = userEvent.setup();
        render(<BotGamePlay />);

        const input = screen.getByPlaceholderText('Enter value 0-180');
        await user.type(input, '60');
        await user.keyboard('{Enter}');

        expect(mockAddPlayerTurn).toHaveBeenCalledWith('p1', 60);
    });

    it('validates invalid input', async () => {
        const user = userEvent.setup();
        render(<BotGamePlay />);

        const input = screen.getByPlaceholderText('Enter value 0-180');
        await user.type(input, '999');
        await user.keyboard('{Enter}');

        expect(mockAddPlayerTurn).not.toHaveBeenCalled();
    });

    it('renders bot turn and simulates throw', async () => {
        jest.useFakeTimers();
        (useBotGameContext as jest.Mock).mockReturnValue({
            ...defaultContextValues,
            players: [
                { id: 'p1', name: 'Player 1', score: 441, isCurrentPlayer: false, isBot: false, turns: [] },
                { id: 'b1', name: 'Bot', score: 501, isCurrentPlayer: true, isBot: true, turns: [] },
            ],
        });

        render(<BotGamePlay />);

        expect(screen.getByText("Bot's Turn")).toBeInTheDocument();
        expect(screen.getByText('Bot is thinking...')).toBeInTheDocument();

        act(() => {
            jest.advanceTimersByTime(3000);
        });

        await waitFor(() => {
            expect(mockSetLoading).toHaveBeenCalledWith(true);
        });

        act(() => {
            jest.runAllTimers();
        });

        expect(mockAddBotTurn).toHaveBeenCalledWith('b1', 20);
        expect(mockSetLoading).toHaveBeenCalledWith(false);

        jest.useRealTimers();
    });

    it('renders game finished modal when there is a winner', () => {
        (useBotGameContext as jest.Mock).mockReturnValue({
            ...defaultContextValues,
            players: [
                { id: 'p1', name: 'Player 1', score: 0, isCurrentPlayer: true, isBot: false, turns: [] }, // Winner
                { id: 'b1', name: 'Bot', score: 501, isCurrentPlayer: false, isBot: true, turns: [] },
            ],
        });

        render(<BotGamePlay />);

        expect(screen.getByTestId('game-finished-modal')).toBeInTheDocument();
    });

    it('allows undoing the last turn', async () => {
        const user = userEvent.setup();
        (useBotGameContext as jest.Mock).mockReturnValue({
            ...defaultContextValues,
            players: [
                { id: 'p1', name: 'Player 1', score: 441, isCurrentPlayer: false, isBot: false, turns: [60] },
                { id: 'b1', name: 'Bot', score: 501, isCurrentPlayer: true, isBot: true, turns: [] },
            ],
        });

        render(<BotGamePlay />);

        const undoButton = screen.getByTestId('undo-icon');
        await user.click(undoButton);

        expect(mockDeleteLastPlayerTurn).toHaveBeenCalledWith('p1');
    });
});
