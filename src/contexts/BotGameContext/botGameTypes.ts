import type {
  BaseGameAction,
  BaseGameState,
} from '../shared/gameTypes';

export const BotDifficulty = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  EXPERT: 'expert',
} as const;

export type BotDifficulty = (typeof BotDifficulty)[keyof typeof BotDifficulty];

export type BotGameAction =
  | BaseGameAction
  | { type: 'SET_BOT_DIFFICULTY'; payload: BotDifficulty }
  | {
      type: 'ADD_BOT_TURN';
      payload: { playerId: string; turn: number };
    }
  | { type: 'SET_LOADING'; payload: boolean };

export interface BotGameState extends BaseGameState {
  botDifficulty: BotDifficulty;
  isLoading: boolean;
}
