import type { Player } from '@/contexts/shared/gameTypes';

export const useGameState = (players: Player[]) => {
    const currentPlayer = players.find(({ isCurrentPlayer }) => isCurrentPlayer);
    const activePlayerId = currentPlayer?.id || '';
    const currentPlayerIndex = players.findIndex(
        ({ isCurrentPlayer }) => isCurrentPlayer
    );
    const previousPlayerIndex =
        currentPlayerIndex > 0 ? currentPlayerIndex - 1 : players.length - 1;
    const previousPlayer = players[previousPlayerIndex];
    const winner = players.find(({ score }) => score === 0);
    const gameFinished = !!winner;

    return {
        currentPlayer,
        activePlayerId,
        currentPlayerIndex,
        previousPlayer,
        winner,
        gameFinished,
    };
};
