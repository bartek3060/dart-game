import { useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import {
  PlayerGameContext,
  type PlayerGameContextModel,
} from './PlayerGameContext';
import { gameReducer, initialState } from './gameReducer';

export function GameContextProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const addPlayerInput = useCallback(() => {
    dispatch({ type: 'ADD_PLAYER_INPUT' });
  }, []);

  const removePlayerInput = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_PLAYER_INPUT', payload: index });
  }, []);

  const setPlayerName = useCallback((id: string, name: string) => {
    dispatch({ type: 'SET_PLAYER_NAME', payload: { playerId: id, name } });
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const addPlayerTurn = useCallback((playerId: string, turn: number) => {
    dispatch({ type: 'ADD_PLAYER_TURN', payload: { playerId, turn } });
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

  const value: PlayerGameContextModel = {
    players: state.players,
    addPlayerInput,
    removePlayerInput,
    setPlayerName,
    startRealPlayersGame: startGame,
    addPlayerTurn,
    resetAndStartGame,
    resetGame,
    deleteLastPlayerTurn,
  };

  return (
    <PlayerGameContext.Provider value={value}>
      {children}
    </PlayerGameContext.Provider>
  );
}
