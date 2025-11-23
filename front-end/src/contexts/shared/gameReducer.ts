import type { BaseGameAction, BaseGameState, Player } from './gameTypes';

export const getNewPlayer = (
    index: number,
    isBot: boolean = false
): Player => {
    return {
        id: `player-${index}`,
        name: isBot ? `Bot ${index}` : `Player ${index + 1}`,
        turns: [],
        isBot: isBot,
        isCurrentPlayer: false,
        isWinner: false,
        score: 501,
    };
};

export const baseGameReducer = <S extends BaseGameState>(
    state: S,
    action: BaseGameAction
): S => {
    switch (action.type) {
        case 'SET_PLAYER_NAME':
            return {
                ...state,
                players: state.players.map((player) =>
                    player.id === action.payload.playerId
                        ? { ...player, name: action.payload.name }
                        : player
                ),
            };

        case 'START_GAME': {
            return {
                ...state,
                players: state.players.map((player, index) => ({
                    ...player,
                    isCurrentPlayer: index === 0,
                })),
            };
        }

        case 'ADD_PLAYER_TURN': {
            const currentPlayerIndex = state.players.findIndex(
                (p) => p.id === action.payload.playerId
            );

            const updatedPlayers = state.players.map((player, index) => {
                if (index === currentPlayerIndex) {
                    const scoreAfterThrow = player.score - action.payload.turn;
                    const newScore =
                        scoreAfterThrow < 0 || scoreAfterThrow === 1
                            ? player.score
                            : scoreAfterThrow;
                    return {
                        ...player,
                        turns: [...player.turns, action.payload.turn],
                        score: newScore,
                    };
                }
                return player;
            });

            const isGameEnded = updatedPlayers.some(({ score }) => score === 0);
            if (!isGameEnded) {
                const nextPlayerIndex =
                    (currentPlayerIndex + 1) % updatedPlayers.length;
                const updatedPlayersWithTurn = updatedPlayers.map((player, index) => ({
                    ...player,
                    isCurrentPlayer: index === nextPlayerIndex,
                }));

                return {
                    ...state,
                    players: updatedPlayersWithTurn,
                };
            }

            return { ...state, players: updatedPlayers };
        }

        case 'RESET_AND_START_GAME': {
            const currentPlayerIndex = state.players.findIndex(
                ({ isCurrentPlayer }) => isCurrentPlayer
            );
            return {
                ...state,
                players: state.players.map((player, index) => ({
                    ...player,
                    turns: [],
                    // Preserve isBot status if it exists, otherwise default to false (though it should exist)
                    isBot: player.isBot,
                    isCurrentPlayer:
                        index === (currentPlayerIndex + 1) % state.players.length,
                    isWinner: false,
                    score: 501,
                })),
            };
        }

        case 'RESET_GAME': {
            return state;
        }

        case 'DELETE_PLAYER_TURN': {
            const playerIndex = state.players.findIndex(
                ({ id }) => id === action.payload.playerId
            );

            if (state.players[playerIndex].turns.length === 0) {
                return state;
            }

            return {
                ...state,
                players: state.players.map((player) => {
                    if (player.id === state.players[playerIndex].id) {
                        const lastTurn = player.turns[player.turns.length - 1] || 0;
                        return {
                            ...player,
                            turns: player.turns.slice(0, -1),
                            score: player.score + lastTurn,
                            isCurrentPlayer: true,
                        };
                    }
                    return {
                        ...player,
                        isCurrentPlayer: false,
                    };
                }),
            };
        }

        default:
            return state;
    }
};
