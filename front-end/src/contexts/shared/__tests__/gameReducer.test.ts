import { getNewPlayer, baseGameReducer } from '../gameReducer';
import type { BaseGameState, BaseGameAction } from '../gameTypes';

describe('getNewPlayer', () => {
    describe('Human Player Creation', () => {
        it('should create a human player with correct defaults', () => {
            const player = getNewPlayer(0, false);

            expect(player).toEqual({
                id: 'player-0',
                name: 'Player 1',
                turns: [],
                isBot: false,
                isCurrentPlayer: false,
                isWinner: false,
                score: 501,
            });
        });

        it('should create human players with sequential IDs', () => {
            const player1 = getNewPlayer(0, false);
            const player2 = getNewPlayer(1, false);
            const player3 = getNewPlayer(2, false);

            expect(player1.id).toBe('player-0');
            expect(player2.id).toBe('player-1');
            expect(player3.id).toBe('player-2');
        });

        it('should create human players with sequential names', () => {
            const player1 = getNewPlayer(0, false);
            const player2 = getNewPlayer(1, false);
            const player3 = getNewPlayer(2, false);

            expect(player1.name).toBe('Player 1');
            expect(player2.name).toBe('Player 2');
            expect(player3.name).toBe('Player 3');
        });

        it('should default to human player when isBot is not provided', () => {
            const player = getNewPlayer(0);

            expect(player.isBot).toBe(false);
            expect(player.name).toBe('Player 1');
        });
    });

    describe('Bot Player Creation', () => {
        it('should create a bot player with correct defaults', () => {
            const player = getNewPlayer(1, true);

            expect(player).toEqual({
                id: 'player-1',
                name: 'Bot 1',
                turns: [],
                isBot: true,
                isCurrentPlayer: false,
                isWinner: false,
                score: 501,
            });
        });

        it('should create bot players with sequential IDs', () => {
            const bot1 = getNewPlayer(0, true);
            const bot2 = getNewPlayer(1, true);
            const bot3 = getNewPlayer(2, true);

            expect(bot1.id).toBe('player-0');
            expect(bot2.id).toBe('player-1');
            expect(bot3.id).toBe('player-2');
        });

        it('should create bot players with sequential names', () => {
            const bot1 = getNewPlayer(0, true);
            const bot2 = getNewPlayer(1, true);
            const bot3 = getNewPlayer(2, true);

            expect(bot1.name).toBe('Bot 0');
            expect(bot2.name).toBe('Bot 1');
            expect(bot3.name).toBe('Bot 2');
        });
    });
});

describe('baseGameReducer', () => {
    const createMockPlayer = (
        id: string,
        name: string,
        score: number = 501,
        isBot: boolean = false
    ) => ({
        id,
        name,
        turns: [],
        isBot,
        isCurrentPlayer: false,
        isWinner: false,
        score,
    });

    const initialState: BaseGameState = {
        players: [
            createMockPlayer('player-0', 'Player 1'),
            createMockPlayer('player-1', 'Player 2'),
        ],
    };

    describe('SET_PLAYER_NAME', () => {
        it('should update player name by ID', () => {
            const action: BaseGameAction = {
                type: 'SET_PLAYER_NAME',
                payload: { playerId: 'player-0', name: 'Alice' },
            };
            const result = baseGameReducer(initialState, action);

            expect(result.players[0].name).toBe('Alice');
            expect(result.players[1].name).toBe('Player 2');
        });

        it('should not modify other player names', () => {
            const action: BaseGameAction = {
                type: 'SET_PLAYER_NAME',
                payload: { playerId: 'player-1', name: 'Bob' },
            };
            const result = baseGameReducer(initialState, action);

            expect(result.players[0].name).toBe('Player 1');
            expect(result.players[1].name).toBe('Bob');
        });

        it('should handle non-existent player ID gracefully', () => {
            const action: BaseGameAction = {
                type: 'SET_PLAYER_NAME',
                payload: { playerId: 'non-existent', name: 'Ghost' },
            };
            const result = baseGameReducer(initialState, action);

            expect(result.players[0].name).toBe('Player 1');
            expect(result.players[1].name).toBe('Player 2');
        });
    });

    describe('START_GAME', () => {
        it('should set first player as current player', () => {
            const action: BaseGameAction = { type: 'START_GAME' };
            const result = baseGameReducer(initialState, action);

            expect(result.players[0].isCurrentPlayer).toBe(true);
            expect(result.players[1].isCurrentPlayer).toBe(false);
        });

        it('should work with multiple players', () => {
            const multiPlayerState: BaseGameState = {
                players: [
                    createMockPlayer('player-0', 'Player 1'),
                    createMockPlayer('player-1', 'Player 2'),
                    createMockPlayer('player-2', 'Player 3'),
                ],
            };
            const action: BaseGameAction = { type: 'START_GAME' };
            const result = baseGameReducer(multiPlayerState, action);

            expect(result.players[0].isCurrentPlayer).toBe(true);
            expect(result.players[1].isCurrentPlayer).toBe(false);
            expect(result.players[2].isCurrentPlayer).toBe(false);
        });
    });

    describe('ADD_PLAYER_TURN', () => {
        it('should add turn and update score', () => {
            const gameStartedState: BaseGameState = {
                players: [
                    { ...createMockPlayer('player-0', 'Player 1'), isCurrentPlayer: true },
                    createMockPlayer('player-1', 'Player 2'),
                ],
            };
            const action: BaseGameAction = {
                type: 'ADD_PLAYER_TURN',
                payload: { playerId: 'player-0', turn: 50 },
            };
            const result = baseGameReducer(gameStartedState, action);

            expect(result.players[0].turns).toEqual([50]);
            expect(result.players[0].score).toBe(451);
        });

        it('should switch to next player after turn', () => {
            const gameStartedState: BaseGameState = {
                players: [
                    { ...createMockPlayer('player-0', 'Player 1'), isCurrentPlayer: true },
                    createMockPlayer('player-1', 'Player 2'),
                ],
            };
            const action: BaseGameAction = {
                type: 'ADD_PLAYER_TURN',
                payload: { playerId: 'player-0', turn: 50 },
            };
            const result = baseGameReducer(gameStartedState, action);

            expect(result.players[0].isCurrentPlayer).toBe(false);
            expect(result.players[1].isCurrentPlayer).toBe(true);
        });

        it('should handle bust (score goes below 0)', () => {
            const gameStartedState: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 40),
                        isCurrentPlayer: true,
                    },
                    createMockPlayer('player-1', 'Player 2'),
                ],
            };
            const action: BaseGameAction = {
                type: 'ADD_PLAYER_TURN',
                payload: { playerId: 'player-0', turn: 50 },
            };
            const result = baseGameReducer(gameStartedState, action);

            expect(result.players[0].score).toBe(40); // Score unchanged
            expect(result.players[0].turns).toEqual([50]); // Turn still recorded
        });

        it('should handle bust (score becomes 1)', () => {
            const gameStartedState: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 51),
                        isCurrentPlayer: true,
                    },
                    createMockPlayer('player-1', 'Player 2'),
                ],
            };
            const action: BaseGameAction = {
                type: 'ADD_PLAYER_TURN',
                payload: { playerId: 'player-0', turn: 50 },
            };
            const result = baseGameReducer(gameStartedState, action);

            expect(result.players[0].score).toBe(51); // Score unchanged
            expect(result.players[0].turns).toEqual([50]);
        });

        it('should end game when player reaches 0', () => {
            const gameStartedState: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 50),
                        isCurrentPlayer: true,
                    },
                    createMockPlayer('player-1', 'Player 2'),
                ],
            };
            const action: BaseGameAction = {
                type: 'ADD_PLAYER_TURN',
                payload: { playerId: 'player-0', turn: 50 },
            };
            const result = baseGameReducer(gameStartedState, action);

            expect(result.players[0].score).toBe(0);
            expect(result.players[0].isCurrentPlayer).toBe(true); // No turn change
            expect(result.players[1].isCurrentPlayer).toBe(false);
        });

        it('should cycle through players correctly', () => {
            const multiPlayerState: BaseGameState = {
                players: [
                    createMockPlayer('player-0', 'Player 1'),
                    { ...createMockPlayer('player-1', 'Player 2'), isCurrentPlayer: true },
                    createMockPlayer('player-2', 'Player 3'),
                ],
            };
            const action: BaseGameAction = {
                type: 'ADD_PLAYER_TURN',
                payload: { playerId: 'player-1', turn: 30 },
            };
            const result = baseGameReducer(multiPlayerState, action);

            expect(result.players[0].isCurrentPlayer).toBe(false);
            expect(result.players[1].isCurrentPlayer).toBe(false);
            expect(result.players[2].isCurrentPlayer).toBe(true);
        });

        it('should wrap around to first player', () => {
            const multiPlayerState: BaseGameState = {
                players: [
                    createMockPlayer('player-0', 'Player 1'),
                    createMockPlayer('player-1', 'Player 2'),
                    { ...createMockPlayer('player-2', 'Player 3'), isCurrentPlayer: true },
                ],
            };
            const action: BaseGameAction = {
                type: 'ADD_PLAYER_TURN',
                payload: { playerId: 'player-2', turn: 30 },
            };
            const result = baseGameReducer(multiPlayerState, action);

            expect(result.players[0].isCurrentPlayer).toBe(true);
            expect(result.players[1].isCurrentPlayer).toBe(false);
            expect(result.players[2].isCurrentPlayer).toBe(false);
        });
    });

    describe('RESET_AND_START_GAME', () => {
        it('should reset all players and advance current player', () => {
            const stateWithTurns: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 400),
                        turns: [50, 51],
                        isCurrentPlayer: false,
                    },
                    {
                        ...createMockPlayer('player-1', 'Player 2', 450),
                        turns: [25],
                        isCurrentPlayer: true,
                    },
                ],
            };
            const action: BaseGameAction = { type: 'RESET_AND_START_GAME' };
            const result = baseGameReducer(stateWithTurns, action);

            expect(result.players[0].score).toBe(501);
            expect(result.players[0].turns).toEqual([]);
            expect(result.players[1].score).toBe(501);
            expect(result.players[1].turns).toEqual([]);
            expect(result.players[0].isCurrentPlayer).toBe(true);
            expect(result.players[1].isCurrentPlayer).toBe(false);
        });

        it('should preserve isBot status', () => {
            const stateWithBot: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 400, false),
                        turns: [50],
                        isCurrentPlayer: true,
                    },
                    {
                        ...createMockPlayer('player-1', 'Bot 1', 450, true),
                        turns: [25],
                        isCurrentPlayer: false,
                    },
                ],
            };
            const action: BaseGameAction = { type: 'RESET_AND_START_GAME' };
            const result = baseGameReducer(stateWithBot, action);

            expect(result.players[0].isBot).toBe(false);
            expect(result.players[1].isBot).toBe(true);
        });

        it('should reset isWinner flag', () => {
            const stateWithWinner: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 0),
                        isWinner: true,
                        isCurrentPlayer: true,
                    },
                    createMockPlayer('player-1', 'Player 2', 400),
                ],
            };
            const action: BaseGameAction = { type: 'RESET_AND_START_GAME' };
            const result = baseGameReducer(stateWithWinner, action);

            expect(result.players[0].isWinner).toBe(false);
            expect(result.players[1].isWinner).toBe(false);
        });
    });

    describe('DELETE_PLAYER_TURN', () => {
        it('should remove last turn and restore score', () => {
            const stateWithTurns: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 400),
                        turns: [50, 51],
                        isCurrentPlayer: false,
                    },
                    {
                        ...createMockPlayer('player-1', 'Player 2', 450),
                        turns: [25],
                        isCurrentPlayer: true,
                    },
                ],
            };
            const action: BaseGameAction = {
                type: 'DELETE_PLAYER_TURN',
                payload: { playerId: 'player-0' },
            };
            const result = baseGameReducer(stateWithTurns, action);

            expect(result.players[0].turns).toEqual([50]);
            expect(result.players[0].score).toBe(451); // 400 + 51
        });

        it('should make the player whose turn was deleted the current player', () => {
            const stateWithTurns: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 400),
                        turns: [50, 51],
                        isCurrentPlayer: false,
                    },
                    {
                        ...createMockPlayer('player-1', 'Player 2', 450),
                        turns: [25],
                        isCurrentPlayer: true,
                    },
                ],
            };
            const action: BaseGameAction = {
                type: 'DELETE_PLAYER_TURN',
                payload: { playerId: 'player-0' },
            };
            const result = baseGameReducer(stateWithTurns, action);

            expect(result.players[0].isCurrentPlayer).toBe(true);
            expect(result.players[1].isCurrentPlayer).toBe(false);
        });

        it('should do nothing if player has no turns', () => {
            const action: BaseGameAction = {
                type: 'DELETE_PLAYER_TURN',
                payload: { playerId: 'player-0' },
            };
            const result = baseGameReducer(initialState, action);

            expect(result).toEqual(initialState);
        });

        it('should handle deleting the only turn', () => {
            const stateWithOneTurn: BaseGameState = {
                players: [
                    {
                        ...createMockPlayer('player-0', 'Player 1', 451),
                        turns: [50],
                        isCurrentPlayer: false,
                    },
                    createMockPlayer('player-1', 'Player 2'),
                ],
            };
            const action: BaseGameAction = {
                type: 'DELETE_PLAYER_TURN',
                payload: { playerId: 'player-0' },
            };
            const result = baseGameReducer(stateWithOneTurn, action);

            expect(result.players[0].turns).toEqual([]);
            expect(result.players[0].score).toBe(501); // 451 + 50
        });
    });

    describe('RESET_GAME', () => {
        it('should return state unchanged', () => {
            const action: BaseGameAction = { type: 'RESET_GAME' };
            const result = baseGameReducer(initialState, action);

            expect(result).toEqual(initialState);
        });
    });

    describe('Unknown Action', () => {
        it('should return state unchanged for unknown action', () => {
            const action = { type: 'UNKNOWN_ACTION' } as unknown as BaseGameAction;
            const result = baseGameReducer(initialState, action);

            expect(result).toEqual(initialState);
        });
    });
});
