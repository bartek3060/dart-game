import type { Player } from '../PlayerGameContext/gameTypes';

export const BotDifficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
} as const;

export type BotDifficulty = (typeof BotDifficulty)[keyof typeof BotDifficulty];

export type BotGameAction =
  | { type: 'SET_PLAYER_NAME'; payload: { playerId: string; name: string } }
  | { type: 'SET_BOT_DIFFICULTY'; payload: BotDifficulty }
  | { type: 'START_GAME' }
  | {
      type: 'ADD_PLAYER_TURN';
      payload: { playerId: string; turn: number };
    }
  | {
      type: 'ADD_BOT_TURN';
      payload: { playerId: string; turn: number };
    }
  | { type: 'END_GAME'; payload: Player }
  | { type: 'RESET_AND_START_GAME' }
  | { type: 'RESET_GAME' }
  | { type: 'DELETE_PLAYER_TURN'; payload: { playerId: string } }
  | { type: 'SET_LOADING'; payload: boolean };

export interface BotGameState {
  botDifficulty: BotDifficulty;
  isLoading: boolean;
  players: Player[];
}
