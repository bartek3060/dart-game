import type {
  BaseGameAction,
  Player,
} from '../shared/gameTypes';

export type { Player };


export type GameAction =
  | BaseGameAction
  | { type: 'ADD_PLAYER_INPUT' }
  | { type: 'REMOVE_PLAYER_INPUT'; payload: number };
