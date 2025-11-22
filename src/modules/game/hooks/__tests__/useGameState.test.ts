import { renderHook } from '@testing-library/react';
import { useGameState } from '../useGameState';
import { Player } from '@/contexts/shared/gameTypes';

describe('useGameState', () => {
    const mockPlayers: Player[] = [
        {
            id: 'p1',
            name: 'Player 1',
            score: 301,
            isCurrentPlayer: true,
            isBot: false,
            turns: [],
            isWinner: false,
        },
        {
            id: 'p2',
            name: 'Player 2',
            score: 501,
            isCurrentPlayer: false,
            isBot: false,
            turns: [],
            isWinner: false,
        },
    ];

    it('should derive current player correctly', () => {
        const { result } = renderHook(() => useGameState(mockPlayers));

        expect(result.current.currentPlayer).toEqual(mockPlayers[0]);
        expect(result.current.activePlayerId).toBe('p1');
        expect(result.current.currentPlayerIndex).toBe(0);
    });

    it('should derive previous player correctly (circular)', () => {
        const { result } = renderHook(() => useGameState(mockPlayers));

        // Current is index 0, so previous should be last element (index 1)
        expect(result.current.previousPlayer).toEqual(mockPlayers[1]);
    });

    it('should derive previous player correctly (linear)', () => {
        const players2 = [
            { ...mockPlayers[0], isCurrentPlayer: false },
            { ...mockPlayers[1], isCurrentPlayer: true },
        ];
        const { result } = renderHook(() => useGameState(players2));

        // Current is index 1, so previous should be index 0
        expect(result.current.previousPlayer).toEqual(players2[0]);
    });

    it('should detect winner', () => {
        const playersWithWinner = [
            { ...mockPlayers[0], score: 0 },
            mockPlayers[1],
        ];
        const { result } = renderHook(() => useGameState(playersWithWinner));

        expect(result.current.winner).toEqual(playersWithWinner[0]);
        expect(result.current.gameFinished).toBe(true);
    });

    it('should handle no current player gracefully', () => {
        const noActivePlayers = mockPlayers.map(p => ({ ...p, isCurrentPlayer: false }));
        const { result } = renderHook(() => useGameState(noActivePlayers));

        expect(result.current.currentPlayer).toBeUndefined();
        expect(result.current.activePlayerId).toBe('');
        expect(result.current.currentPlayerIndex).toBe(-1);
    });
});
