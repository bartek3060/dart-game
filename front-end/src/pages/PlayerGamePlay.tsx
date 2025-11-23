import { usePlayerGameContext } from '@/contexts/PlayerGameContext/usePlayerGameContext';
import { useEffect } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { GameFinishedModal } from '@/modules/game/GameFinishedModal';
import { useGameInput } from '@/modules/game/hooks/useGameInput';
import { useGameState } from '@/modules/game/hooks/useGameState';
import { ScoreInput } from '@/modules/game/components/ScoreInput';
import { PlayerScoreTabs } from '@/modules/game/components/PlayerScoreTabs';
import { CurrentScore } from '@/modules/game/components/CurrentScore';
import { TurnHeader } from '@/modules/game/components/TurnHeader';

export default function PlayerGamePlay() {
  const { players, addPlayerTurn, deleteLastPlayerTurn, resetAndStartGame } =
    usePlayerGameContext();
  const { navigateToConfigureGame } = useNavigation();

  const {
    inputValue,
    setInputValue,
    isEnteredScoreValid,
    resetPlayerInput,
    handleInputChange,
    handleBackspace,
    handleInputKeyDown,
  } = useGameInput();

  const {
    currentPlayer,
    activePlayerId,
    previousPlayer,
    winner,
    gameFinished,
  } = useGameState(players);

  useEffect(() => {
    if (!currentPlayer) {
      return navigateToConfigureGame();
    }
  }, [currentPlayer, navigateToConfigureGame]);

  if (!currentPlayer) {
    return null;
  }

  const handleSubmitTurn = () => {
    if (isEnteredScoreValid) {
      addPlayerTurn(activePlayerId, parseInt(inputValue));
      resetPlayerInput();
    }
  };

  const handleStartAgain = () => {
    resetAndStartGame();
    resetPlayerInput();
  };

  const handleConfigureNewGame = () => {
    resetAndStartGame();
    navigateToConfigureGame();
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Dart Game - 501</CardTitle>
          <CardDescription>Points countdown from 501 to 0</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <>
            <div>
              <h2 className="text-sm font-semibold mb-4">Players Scores</h2>
              <PlayerScoreTabs
                players={players}
                activePlayerId={activePlayerId}
              />
              <CurrentScore score={currentPlayer.score} />
            </div>

            {currentPlayer && (
              <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
                <TurnHeader
                  currentPlayer={currentPlayer}
                  onDeleteTurn={() => deleteLastPlayerTurn(previousPlayer?.id || '')}
                  canDeleteTurn={true}
                />
                <CardContent className="space-y-6">
                  <ScoreInput
                    inputValue={inputValue}
                    onInputChange={handleInputChange}
                    onInputKeyDown={(e) =>
                      handleInputKeyDown(e, handleSubmitTurn)
                    }
                    onKeyPress={(digit) => setInputValue(inputValue + digit)}
                    onBackspace={handleBackspace}
                    onEnter={handleSubmitTurn}
                    isScoreValid={isEnteredScoreValid}
                  />
                </CardContent>
              </Card>
            )}
          </>
        </CardContent>
      </Card>
      {winner && (
        <GameFinishedModal
          open={gameFinished}
          winner={winner}
          players={players}
          onStartAgain={handleStartAgain}
          onConfigureNewGame={handleConfigureNewGame}
          onDeleteLastTurn={(playerId) => deleteLastPlayerTurn(playerId)}
        />
      )}
    </div>
  );
}
