import type { GameAction, GameState, Player } from './gameTypes';

const getNewPlayer = (index: number): Player => {
  return {
    id: `player-${index}`,
    name: `Player ${index + 1}`,
    turns: [],
    isBot: false,
    isCurrentPlayer: false,
    isWinner: false,
    score: 501,
  };
};

export const initialState: GameState = {
  players: [getNewPlayer(0), getNewPlayer(1)],
};

export const gameReducer = (
  state: GameState,
  action: GameAction
): GameState => {
  switch (action.type) {
    case 'ADD_PLAYER_INPUT':
      if (state.players.length < 6) {
        return {
          ...state,
          players: [...state.players, getNewPlayer(state.players.length)],
        };
      }
      return state;

    case 'REMOVE_PLAYER_INPUT': {
      if (state.players.length > 2) {
        return {
          ...state,
          players: state.players.filter((_, index) => index !== action.payload),
        };
      }
      return state;
    }

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
          const storeAfterThrows = player.score - action.payload.turn;
          const newScore =
            storeAfterThrows < 0 || storeAfterThrows === 1
              ? player.score
              : storeAfterThrows;
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
          isBot: false,
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
        players: initialState.players.map((player, index) => ({
          ...player,
          isCurrentPlayer: index === 0,
        })),
      };
  }
};
