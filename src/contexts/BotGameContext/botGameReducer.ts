
import type {
  BotGameAction,
  BotGameState
} from './botGameTypes';
import { baseGameReducer, getNewPlayer } from '../shared/gameReducer';

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

    case 'RESET_GAME':
      return {
        ...initialState,
        botDifficulty: state.botDifficulty,
        players: initialState.players.map((player, index) => ({
          ...player,
          isCurrentPlayer: index === 0,
        })),
      };

    default:
      return baseGameReducer(state, action);
  }
};

