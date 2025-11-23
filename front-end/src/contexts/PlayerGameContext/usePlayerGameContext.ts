import React from 'react';
import { PlayerGameContext } from './PlayerGameContext';

export function usePlayerGameContext() {
  const context = React.useContext(PlayerGameContext);
  if (context === undefined) {
    throw new Error(
      'usePlayerGameContext must be used within a PlayerGameContextProvider'
    );
  }
  return context;
}
