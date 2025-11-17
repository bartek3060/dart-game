import { gameReducer } from '../gameReducer';
import type { GameState, GameAction, Player } from '../gameTypes';

const createMockPlayer = (
  id: string,
  name: string,
  score: number = 501
): Player => ({
  id,
  name,
  turns: [],
  isBot: false,
  isCurrentPlayer: false,
  isWinner: false,
  score,
});

describe('gameReducer', () => {
  const initialState: GameState = {
    players: [
      createMockPlayer('player-0', 'Player 1'),
      createMockPlayer('player-1', 'Player 2'),
    ],
  };

  it('should return initial state for unknown action', () => {
    const action = { type: 'UNKNOWN' } as unknown as GameAction;
    const result = gameReducer(initialState, action);

    expect(result.players).toHaveLength(2);
    expect(result.players[0].isCurrentPlayer).toBe(true);
  });

  describe('ADD_PLAYER_INPUT', () => {
    it('should add a new player when under max limit', () => {
      const action: GameAction = { type: 'ADD_PLAYER_INPUT' };
      const result = gameReducer(initialState, action);

      expect(result.players).toHaveLength(3);
      expect(result.players[2].name).toBe('Player 3');
      expect(result.players[2].id).toBe('player-2');
    });

    it('should not add player when at max limit', () => {
      const stateWithMaxPlayers: GameState = {
        players: Array.from({ length: 6 }, (_, i) =>
          createMockPlayer(`player-${i}`, `Player ${i + 1}`)
        ),
      };
      const action: GameAction = { type: 'ADD_PLAYER_INPUT' };
      const result = gameReducer(stateWithMaxPlayers, action);

      expect(result.players).toHaveLength(6);
    });
  });

  describe('REMOVE_PLAYER_INPUT', () => {
    it('should remove player at specified index when above min limit', () => {
      const stateWithThreePlayers: GameState = {
        players: [
          createMockPlayer('player-0', 'Player 1'),
          createMockPlayer('player-1', 'Player 2'),
          createMockPlayer('player-2', 'Player 3'),
        ],
      };
      const action: GameAction = { type: 'REMOVE_PLAYER_INPUT', payload: 1 };
      const result = gameReducer(stateWithThreePlayers, action);

      expect(result.players).toHaveLength(2);
      expect(result.players[0].name).toBe('Player 1');
      expect(result.players[1].name).toBe('Player 3');
    });

    it('should not remove player when at min limit', () => {
      const action: GameAction = { type: 'REMOVE_PLAYER_INPUT', payload: 0 };
      const result = gameReducer(initialState, action);

      expect(result.players).toHaveLength(2);
    });
  });

  describe('SET_PLAYER_NAME', () => {
    it('should update player name', () => {
      const action: GameAction = {
        type: 'SET_PLAYER_NAME',
        payload: { playerId: 'player-0', name: 'Alice' },
      };
      const result = gameReducer(initialState, action);

      expect(result.players[0].name).toBe('Alice');
      expect(result.players[1].name).toBe('Player 2');
    });
  });

  describe('START_GAME', () => {
    it('should set first player as current player', () => {
      const action: GameAction = { type: 'START_GAME' };
      const result = gameReducer(initialState, action);

      expect(result.players[0].isCurrentPlayer).toBe(true);
      expect(result.players[1].isCurrentPlayer).toBe(false);
    });
  });

  describe('ADD_PLAYER_TURN', () => {
    it('should add turn and update score for valid throw', () => {
      const gameStartedState: GameState = {
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1'),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Player 2'),
        ],
      };
      const action: GameAction = {
        type: 'ADD_PLAYER_TURN',
        payload: { playerId: 'player-0', turn: 50 },
      };
      const result = gameReducer(gameStartedState, action);

      expect(result.players[0].turns).toEqual([50]);
      expect(result.players[0].score).toBe(451);
      expect(result.players[1].isCurrentPlayer).toBe(true); // Next player
    });

    it('should handle bust (score goes below 0)', () => {
      const gameStartedState: GameState = {
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 50),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Player 2'),
        ],
      };
      const action: GameAction = {
        type: 'ADD_PLAYER_TURN',
        payload: { playerId: 'player-0', turn: 60 },
      };
      const result = gameReducer(gameStartedState, action);

      expect(result.players[0].turns).toEqual([60]);
      expect(result.players[0].score).toBe(50); // Score unchanged on bust
      expect(result.players[1].isCurrentPlayer).toBe(true);
    });

    it('should handle bust (score becomes 1)', () => {
      const gameStartedState: GameState = {
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 60),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Player 2'),
        ],
      };
      const action: GameAction = {
        type: 'ADD_PLAYER_TURN',
        payload: { playerId: 'player-0', turn: 59 },
      };
      const result = gameReducer(gameStartedState, action);

      expect(result.players[0].turns).toEqual([59]);
      expect(result.players[0].score).toBe(60); // Score unchanged on bust
      expect(result.players[1].isCurrentPlayer).toBe(true);
    });

    it('should end game when player reaches 0', () => {
      const gameStartedState: GameState = {
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 50),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Player 2'),
        ],
      };
      const action: GameAction = {
        type: 'ADD_PLAYER_TURN',
        payload: { playerId: 'player-0', turn: 50 },
      };
      const result = gameReducer(gameStartedState, action);

      expect(result.players[0].turns).toEqual([50]);
      expect(result.players[0].score).toBe(0);
      expect(result.players[0].isCurrentPlayer).toBe(true); // Game ended, no turn change
      expect(result.players[1].isCurrentPlayer).toBe(false);
    });
  });

  describe('RESET_AND_START_GAME', () => {
    it('should reset all players and advance current player', () => {
      const stateWithTurns: GameState = {
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
      const action: GameAction = { type: 'RESET_AND_START_GAME' };
      const result = gameReducer(stateWithTurns, action);

      expect(result.players[0].score).toBe(501);
      expect(result.players[0].turns).toEqual([]);
      expect(result.players[1].score).toBe(501);
      expect(result.players[1].turns).toEqual([]);
      expect(result.players[0].isCurrentPlayer).toBe(true); // Next player becomes current
      expect(result.players[1].isCurrentPlayer).toBe(false);
    });
  });

  describe('DELETE_PLAYER_TURN', () => {
    it('should remove last turn and restore score', () => {
      const stateWithTurns: GameState = {
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
      const action: GameAction = {
        type: 'DELETE_PLAYER_TURN',
        payload: { playerId: 'player-0' },
      };
      const result = gameReducer(stateWithTurns, action);

      expect(result.players[0].turns).toEqual([50]);
      expect(result.players[0].score).toBe(451); // 400 + 51
      expect(result.players[0].isCurrentPlayer).toBe(true);
      expect(result.players[1].isCurrentPlayer).toBe(false);
    });

    it('should do nothing if player has no turns', () => {
      const action: GameAction = {
        type: 'DELETE_PLAYER_TURN',
        payload: { playerId: 'player-0' },
      };
      const result = gameReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
