import { createContext, useContext } from 'react';
import type { BotGameState, BotDifficulty } from './botGameTypes';

export interface BotGameContextModel {
  botDifficulty: BotDifficulty;
  isLoading: boolean;
  players: BotGameState['players'];
  setBotDifficulty: (difficulty: BotDifficulty) => void;
  setPlayerName: (playerId: string, name: string) => void;
  startBotGame: () => void;
  addPlayerTurn: (playerId: string, turn: number) => void;
  addBotTurn: (playerId: string, turn: number) => void;
  resetAndStartGame: () => void;
  resetGame: () => void;
  deleteLastPlayerTurn: (playerId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const BotGameContext = createContext<BotGameContextModel | null>(null);

export const useBotGameContext = (): BotGameContextModel => {
  const context = useContext(BotGameContext);
  if (!context) {
    throw new Error(
      'useBotGameContext must be used within BotGameContextProvider'
    );
  }
  return context;
};
