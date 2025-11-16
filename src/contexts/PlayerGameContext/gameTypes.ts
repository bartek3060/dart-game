export interface Player {
  id: string;
  name: string;
  turns: number[];
  isBot: boolean;
  isCurrentPlayer: boolean;
  isWinner: boolean;
  score: number;
}

export interface GameState {
  players: Player[];
}

export type GameAction =
  | { type: "ADD_PLAYER_INPUT" }
  | { type: "REMOVE_PLAYER_INPUT"; payload: number }
  | { type: "SET_PLAYER_NAME"; payload: { playerId: string; name: string } }
  | { type: "START_GAME" }
  | {
      type: "ADD_PLAYER_TURN";
      payload: { playerId: string; turn: number };
    }
  | { type: "END_GAME"; payload: Player }
  | { type: "RESET_AND_START_GAME" }
  | { type: "RESET_GAME" }
  | { type: "DELETE_PLAYER_TURN"; payload: { playerId: string } };
