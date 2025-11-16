import { createContext } from "react";
import type { Player } from "./gameTypes";

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

export interface PlayerGameContextModel {
  players: Player[];
  addPlayerInput: () => void;
  removePlayerInput: (index: number) => void;
  setPlayerName: (id: string, name: string) => void;
  startRealPlayersGame: () => void;
  addPlayerTurn: (playerId: string, turn: number) => void;
  resetAndStartGame: () => void;
  resetGame: () => void;
  deleteLastPlayerTurn: (playerId: string) => void;
}

export const PlayerGameContext = createContext<
  PlayerGameContextModel | undefined
>(undefined);
