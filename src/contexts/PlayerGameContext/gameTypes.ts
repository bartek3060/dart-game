import type {
  BaseGameAction,
  BaseGameState,
  Player,
} from '../shared/gameTypes';

export type { Player };

export interface GameState extends BaseGameState {}

export type GameAction =
  | BaseGameAction
  | { type: 'ADD_PLAYER_INPUT' }
  | { type: 'REMOVE_PLAYER_INPUT'; payload: number };
