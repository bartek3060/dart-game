export const GameMode = {
  REAL_PLAYERS: 'real-players',
  BOT: 'bot',
} as const;

export type GameMode = (typeof GameMode)[keyof typeof GameMode];
