import { gameReducer } from '../botGameReducer';
import type {
  BotGameState,
  BotGameAction,
  BotDifficulty,
} from '../botGameTypes';

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

describe('botGameReducer', () => {
  const initialState: BotGameState = {
    botDifficulty: 'medium',
    isLoading: false,
    players: [
      createMockPlayer('player-0', 'Player 1', 501, false),
      createMockPlayer('player-1', 'Bot 1', 501, true),
    ],
  };

  it('should return initial state for unknown action', () => {
    const action = { type: 'UNKNOWN' } as unknown as BotGameAction;
    const result = gameReducer(initialState, action);

    expect(result).toEqual(initialState);
  });

  describe('SET_PLAYER_NAME', () => {
    it('should update player name', () => {
      const action: BotGameAction = {
        type: 'SET_PLAYER_NAME',
        payload: { playerId: 'player-0', name: 'Alice' },
      };
      const result = gameReducer(initialState, action);

      expect(result.players[0].name).toBe('Alice');
      expect(result.players[1].name).toBe('Bot 1');
    });
  });

  describe('SET_BOT_DIFFICULTY', () => {
    it('should update bot difficulty', () => {
      const action: BotGameAction = {
        type: 'SET_BOT_DIFFICULTY',
        payload: 'hard' as BotDifficulty,
      };
      const result = gameReducer(initialState, action);

      expect(result.botDifficulty).toBe('hard');
    });

    it('should update to easy difficulty', () => {
      const action: BotGameAction = {
        type: 'SET_BOT_DIFFICULTY',
        payload: 'easy' as BotDifficulty,
      };
      const result = gameReducer(initialState, action);

      expect(result.botDifficulty).toBe('easy');
    });
  });

  describe('SET_LOADING', () => {
    it('should update loading state', () => {
      const action: BotGameAction = {
        type: 'SET_LOADING',
        payload: true,
      };
      const result = gameReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      const loadingState: BotGameState = {
        ...initialState,
        isLoading: true,
      };
      const action: BotGameAction = {
        type: 'SET_LOADING',
        payload: false,
      };
      const result = gameReducer(loadingState, action);

      expect(result.isLoading).toBe(false);
    });
  });

  describe('START_GAME', () => {
    it('should set first player as current player', () => {
      const action: BotGameAction = { type: 'START_GAME' };
      const result = gameReducer(initialState, action);

      expect(result.players[0].isCurrentPlayer).toBe(true);
      expect(result.players[1].isCurrentPlayer).toBe(false);
    });
  });

  describe('ADD_PLAYER_TURN', () => {
    it('should add turn and update score for valid throw', () => {
      const gameStartedState: BotGameState = {
        ...initialState,
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 501, false),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Bot 1', 501, true),
        ],
      };
      const action: BotGameAction = {
        type: 'ADD_PLAYER_TURN',
        payload: { playerId: 'player-0', turn: 50 },
      };
      const result = gameReducer(gameStartedState, action);

      expect(result.players[0].turns).toEqual([50]);
      expect(result.players[0].score).toBe(451);
      expect(result.players[1].isCurrentPlayer).toBe(true); // Next player (bot)
    });

    it('should handle bust (score goes below 0)', () => {
      const gameStartedState: BotGameState = {
        ...initialState,
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 50, false),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Bot 1', 501, true),
        ],
      };
      const action: BotGameAction = {
        type: 'ADD_PLAYER_TURN',
        payload: { playerId: 'player-0', turn: 60 },
      };
      const result = gameReducer(gameStartedState, action);

      expect(result.players[0].turns).toEqual([60]);
      expect(result.players[0].score).toBe(50); // Score unchanged on bust
      expect(result.players[1].isCurrentPlayer).toBe(true);
    });

    it('should handle bust (score becomes 1)', () => {
      const gameStartedState: BotGameState = {
        ...initialState,
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 60, false),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Bot 1', 501, true),
        ],
      };
      const action: BotGameAction = {
        type: 'ADD_PLAYER_TURN',
        payload: { playerId: 'player-0', turn: 59 },
      };
      const result = gameReducer(gameStartedState, action);

      expect(result.players[0].turns).toEqual([59]);
      expect(result.players[0].score).toBe(60); // Score unchanged on bust
      expect(result.players[1].isCurrentPlayer).toBe(true);
    });

    it('should end game when player reaches 0', () => {
      const gameStartedState: BotGameState = {
        ...initialState,
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 50, false),
            isCurrentPlayer: true,
          },
          createMockPlayer('player-1', 'Bot 1', 501, true),
        ],
      };
      const action: BotGameAction = {
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

  describe('ADD_BOT_TURN', () => {
    it('should add turn and update score for valid bot throw', () => {
      const botTurnState: BotGameState = {
        ...initialState,
        players: [
          createMockPlayer('player-0', 'Player 1', 451, false),
          {
            ...createMockPlayer('player-1', 'Bot 1', 501, true),
            isCurrentPlayer: true,
          },
        ],
      };
      const action: BotGameAction = {
        type: 'ADD_BOT_TURN',
        payload: { playerId: 'player-1', turn: 40 },
      };
      const result = gameReducer(botTurnState, action);

      expect(result.players[1].turns).toEqual([40]);
      expect(result.players[1].score).toBe(461);
      expect(result.players[0].isCurrentPlayer).toBe(true); // Next player
    });

    it('should handle bust for bot turn', () => {
      const botTurnState: BotGameState = {
        ...initialState,
        players: [
          createMockPlayer('player-0', 'Player 1', 451, false),
          {
            ...createMockPlayer('player-1', 'Bot 1', 30, true),
            isCurrentPlayer: true,
          },
        ],
      };
      const action: BotGameAction = {
        type: 'ADD_BOT_TURN',
        payload: { playerId: 'player-1', turn: 35 },
      };
      const result = gameReducer(botTurnState, action);

      expect(result.players[1].turns).toEqual([35]);
      expect(result.players[1].score).toBe(30); // Score unchanged on bust
      expect(result.players[0].isCurrentPlayer).toBe(true);
    });

    it('should end game when bot reaches 0', () => {
      const botTurnState: BotGameState = {
        ...initialState,
        players: [
          createMockPlayer('player-0', 'Player 1', 451, false),
          {
            ...createMockPlayer('player-1', 'Bot 1', 50, true),
            isCurrentPlayer: true,
          },
        ],
      };
      const action: BotGameAction = {
        type: 'ADD_BOT_TURN',
        payload: { playerId: 'player-1', turn: 50 },
      };
      const result = gameReducer(botTurnState, action);

      expect(result.players[1].turns).toEqual([50]);
      expect(result.players[1].score).toBe(0);
      expect(result.players[1].isCurrentPlayer).toBe(true); // Game ended, no turn change
      expect(result.players[0].isCurrentPlayer).toBe(false);
    });
  });

  describe('RESET_AND_START_GAME', () => {
    it('should reset all players and advance current player', () => {
      const stateWithTurns: BotGameState = {
        ...initialState,
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 400, false),
            turns: [50, 51],
            isCurrentPlayer: false,
          },
          {
            ...createMockPlayer('player-1', 'Bot 1', 450, true),
            turns: [25],
            isCurrentPlayer: true,
          },
        ],
      };
      const action: BotGameAction = { type: 'RESET_AND_START_GAME' };
      const result = gameReducer(stateWithTurns, action);

      expect(result.players[0].score).toBe(501);
      expect(result.players[0].turns).toEqual([]);
      expect(result.players[1].score).toBe(501);
      expect(result.players[1].turns).toEqual([]);
      expect(result.players[0].isCurrentPlayer).toBe(true); // Next player becomes current
      expect(result.players[1].isCurrentPlayer).toBe(false);
      expect(result.players[1].isBot).toBe(true); // Bot status preserved
    });
  });

  describe('DELETE_PLAYER_TURN', () => {
    it('should remove last turn and restore score for human player', () => {
      const stateWithTurns: BotGameState = {
        ...initialState,
        players: [
          {
            ...createMockPlayer('player-0', 'Player 1', 400, false),
            turns: [50, 51],
            isCurrentPlayer: true,
          },
          {
            ...createMockPlayer('player-1', 'Bot 1', 450, true),
            turns: [25],
            isCurrentPlayer: false,
          },
        ],
      };
      const action: BotGameAction = {
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
      const action: BotGameAction = {
        type: 'DELETE_PLAYER_TURN',
        payload: { playerId: 'player-0' },
      };
      const result = gameReducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });

  describe('RESET_GAME', () => {
    it('should reset to initial state while preserving bot difficulty', () => {
      const modifiedState: BotGameState = {
        botDifficulty: 'hard',
        isLoading: true,
        players: [
          {
            ...createMockPlayer('player-0', 'Alice', 300, false),
            turns: [100, 101],
            isCurrentPlayer: true,
            isWinner: false,
          },
          {
            ...createMockPlayer('player-1', 'Bot Charlie', 400, true),
            turns: [50, 51],
            isCurrentPlayer: false,
            isWinner: false,
          },
        ],
      };

      const action: BotGameAction = { type: 'RESET_GAME' };
      const result = gameReducer(modifiedState, action);

      // Should reset to initial values but keep bot difficulty
      expect(result.botDifficulty).toBe('hard'); // Preserved
      expect(result.isLoading).toBe(false);
      expect(result.players).toHaveLength(2);
      expect(result.players[0]).toEqual(
        expect.objectContaining({
          id: 'player-0',
          name: 'Player 1',
          score: 501,
          turns: [],
          isBot: false,
          isCurrentPlayer: true,
          isWinner: false,
        })
      );
      expect(result.players[1]).toEqual(
        expect.objectContaining({
          id: 'player-1',
          name: 'Bot 1',
          score: 501,
          turns: [],
          isBot: true,
          isCurrentPlayer: false,
          isWinner: false,
        })
      );
    });
  });
});
