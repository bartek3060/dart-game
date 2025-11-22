import type { Player } from '../PlayerGameContext/gameTypes';
import type {
  BotGameAction,
  BotGameState,
  BotDifficulty,
} from './botGameTypes';

// Balanced bot AI function that considers remaining points but is more beatable
const generateBotThrow = (
  currentScore: number,
  difficulty: BotDifficulty
): number => {
  let score: number;

  // Helper function to add randomness based on difficulty
  const addError = (baseScore: number, errorRate: number): number => {
    if (Math.random() < errorRate) {
      // Add significant error for lower difficulty bots
      const error = Math.floor(Math.random() * 41) - 20; // ±20 points
      return Math.max(0, Math.min(180, baseScore + error));
    }
    return baseScore;
  };

  switch (difficulty) {
    case 'easy':
      if (currentScore <= 180 && Math.random() < 0.05) {
        score = currentScore;
      } else if (currentScore > 200) {
        // High scores, mostly low throws
        score = Math.floor(Math.random() * 41); // 0-40 range
      } else if (currentScore > 100) {
        // Medium scores, still conservative
        score = Math.floor(Math.random() * 36); // 0-35 range
      } else if (currentScore > 60) {
        // Lower scores, very conservative
        score = Math.floor(Math.random() * 31); // 0-30 range
      } else {
        // Low scores, very weak throws
        score = Math.floor(Math.random() * Math.min(25, currentScore - 1));
      }
      // Easy bots make lots of errors and are inconsistent
      score = addError(score, 0.4);
      break;

    case 'medium':
      // Medium: Moderate play, some understanding, still beatable
      if (currentScore <= 180 && Math.random() < 0.1) {
        score = currentScore;
      } else if (currentScore > 200) {
        // High scores, mostly moderate throws
        score = 30 + Math.floor(Math.random() * 51); // 30-80 range
      } else if (currentScore > 120) {
        // Medium-high scores
        score = 25 + Math.floor(Math.random() * 46); // 25-70 range
      } else if (currentScore > 60) {
        // Lower scores, still conservative
        score = 20 + Math.floor(Math.random() * 36); // 20-55 range
      } else {
        // Very low scores, safer throws
        score = Math.floor(Math.random() * Math.min(30, currentScore - 1));
      }
      // Medium bots make some errors
      score = addError(score, 0.25);
      break;

    case 'hard':
      // Hard: Better player, but still beatable
      if (currentScore <= 180 && Math.random() < 0.2) {
        score = currentScore;
      } else if (currentScore > 200) {
        // High scores, good throws
        score = 60 + Math.floor(Math.random() * 61); // 60-120 range
      } else if (currentScore > 120) {
        // Medium-high scores
        score = 50 + Math.floor(Math.random() * 51); // 50-100 range
      } else if (currentScore > 60) {
        // Good positioning throws
        score = 40 + Math.floor(Math.random() * 41); // 40-80 range
      } else {
        // Low scores, decent throws
        score = Math.floor(Math.random() * Math.min(45, currentScore - 1));
      }
      // Hard bots make fewer errors
      score = addError(score, 0.15);
      break;

    case 'expert':
      if (currentScore <= 180 && Math.random() < 0.3) {
        score = currentScore;
      } else if (currentScore > 200) {
        // High scores, consistent good throws
        score = 80 + Math.floor(Math.random() * 61); // 80-140 range
      } else if (currentScore > 120) {
        // Medium-high scores, strategic
        score = 70 + Math.floor(Math.random() * 51); // 70-120 range
      } else if (currentScore > 60) {
        // Smart positioning
        score = 60 + Math.floor(Math.random() * 41); // 60-100 range
      } else {
        // Low scores, good throws
        score = Math.floor(Math.random() * Math.min(55, currentScore - 1));
      }
      // Expert bots still make some errors
      score = addError(score, 0.08);
      break;

    default:
      score = Math.floor(Math.random() * 181);
  }

  // Ensure score is valid (no busting)
  // Can't go below 0 or leave exactly 1 (busting rules)
  if (score > currentScore || currentScore - score === 1 || score > 180) {
    // Find a safe score
    const maxSafeScore = Math.min(currentScore - 2, 180);
    if (maxSafeScore > 0) {
      score = Math.floor(Math.random() * (maxSafeScore + 1));
    } else {
      score = 0; // Last resort
    }
  }

  return Math.max(0, Math.min(180, score));
};

const getNewPlayer = (index: number, isBot: boolean = false): Player => {
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

export const initialState: BotGameState = {
  botDifficulty: 'medium' as const,
  isLoading: false,
  players: [getNewPlayer(0, false), getNewPlayer(1, true)],
};

export const gameReducer = (
  state: BotGameState,
  action: BotGameAction
): BotGameState => {
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

    case 'SET_BOT_DIFFICULTY':
      return {
        ...state,
        botDifficulty: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
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

    case 'ADD_BOT_TURN': {
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
          isBot: index === 1, // Keep bot as bot
          isCurrentPlayer:
            index === (currentPlayerIndex + 1) % state.players.length,
          isWinner: false,
          score: 501,
        })),
      };
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
      return {
        ...initialState,
        botDifficulty: state.botDifficulty,
        players: initialState.players.map((player, index) => ({
          ...player,
          isCurrentPlayer: index === 0,
        })),
      };
  }
};

// Export helper function for generating bot throws
export { generateBotThrow };
