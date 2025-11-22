import { useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import { BotGameContext, type BotGameContextModel } from './BotGameContext';
import { gameReducer, initialState } from './botGameReducer';

export function BotGameContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setBotDifficulty = useCallback(
    (difficulty: typeof state.botDifficulty) => {
      dispatch({ type: 'SET_BOT_DIFFICULTY', payload: difficulty });
    },
    [state]
  );

  const setPlayerName = useCallback((id: string, name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: { playerId: id, name } });
  }, []);

  const startBotGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const addPlayerTurn = useCallback((playerId: string, turn: number) => {
    dispatch({ type: 'ADD_PLAYER_TURN', payload: { playerId, turn } });
  }, []);

  const addBotTurn = useCallback((playerId: string, turn: number) => {
    dispatch({ type: 'ADD_BOT_TURN', payload: { playerId, turn } });
  }, []);

  const resetAndStartGame = useCallback(() => {
    dispatch({ type: 'RESET_AND_START_GAME' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const deleteLastPlayerTurn = useCallback((playerId: string) => {
    dispatch({ type: 'DELETE_PLAYER_TURN', payload: { playerId } });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const value: BotGameContextModel = {
    botDifficulty: state.botDifficulty,
    isLoading: state.isLoading,
    players: state.players,
    setBotDifficulty,
    setPlayerName,
    startBotGame,
    addPlayerTurn,
    addBotTurn,
    resetAndStartGame,
    resetGame,
    deleteLastPlayerTurn,
    setLoading,
  };

  return (
    <BotGameContext.Provider value={value}>{children}</BotGameContext.Provider>
  );
}
