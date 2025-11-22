import type { GameAction, GameState } from './gameTypes';
import { baseGameReducer, getNewPlayer } from '../shared/gameReducer';

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

    case 'RESET_GAME':
      return {
        ...initialState,
        players: initialState.players.map((player, index) => ({
          ...player,
          isCurrentPlayer: index === 0,
        })),
      };

    default: {
      return baseGameReducer(state, action);
    }
  }
};
