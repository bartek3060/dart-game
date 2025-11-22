import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useBotGameContext } from '@/contexts/BotGameContext/BotGameContext';
import { useNavigation } from '@/hooks/useNavigation';
import { useEffect, useCallback } from 'react';
import { GameFinishedModal } from '@/modules/game/GameFinishedModal';
import { generateBotThrow } from '@/modules/game/generateBotThrows';
import { useGameInput } from '@/modules/game/hooks/useGameInput';
import { useGameState } from '@/modules/game/hooks/useGameState';
import { ScoreInput } from '@/modules/game/components/ScoreInput';
import { PlayerScoreTabs } from '@/modules/game/components/PlayerScoreTabs';
import { CurrentScore } from '@/modules/game/components/CurrentScore';
import { TurnHeader } from '@/modules/game/components/TurnHeader';

export default function BotGamePlay() {
  const { navigateToConfigureGame } = useNavigation();
  const {
    players,
    botDifficulty,
    isLoading,
    addPlayerTurn,
    addBotTurn,
    deleteLastPlayerTurn,
    resetAndStartGame,
    setLoading,
  } = useBotGameContext();

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

  // Handle bot turn automatically
  const handleBotTurn = useCallback(() => {
    if (currentPlayer?.isBot && !isLoading) {
      setLoading(true);

      // Simulate bot thinking time (2-3 seconds)
      const thinkingTime = 2000 + Math.random() * 1000;

      setTimeout(() => {
        if (currentPlayer && currentPlayer.isBot) {
          const botScore = generateBotThrow(currentPlayer.score, botDifficulty);
          addBotTurn(currentPlayer.id, botScore);
          setLoading(false);
        }
      }, thinkingTime);
    }
  }, [currentPlayer, botDifficulty, addBotTurn, setLoading, isLoading]);

  useEffect(() => {
    if (!currentPlayer) {
      return navigateToConfigureGame();
    }

    // Auto-trigger bot turn
    handleBotTurn();
  }, [currentPlayer, navigateToConfigureGame, handleBotTurn]);

  if (!currentPlayer) {
    return null;
  }

  const handleSubmitTurn = () => {
    if (isEnteredScoreValid && !currentPlayer.isBot) {
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

  const canDeleteTurn = () => {
    // Can delete the last turn if the previous player has turns and is not a bot
    return (
      !!previousPlayer &&
      !previousPlayer.isBot &&
      previousPlayer.turns.length > 0
    );
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Dart Game vs Bot - 501</CardTitle>
          <CardDescription>
            Points countdown from 501 to 0. Playing against {botDifficulty} bot.
          </CardDescription>
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
              <Card
                className={`${currentPlayer.isBot
                  ? 'bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20'
                  : 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'
                  }`}
              >
                <TurnHeader
                  currentPlayer={currentPlayer}
                  onDeleteTurn={() => deleteLastPlayerTurn(previousPlayer?.id || '')}
                  canDeleteTurn={canDeleteTurn()}
                />
                <CardContent className="space-y-6">
                  {currentPlayer.isBot ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Bot is calculating the best throw...
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ScoreInput
                      inputValue={inputValue}
                      onInputChange={handleInputChange}
                      onInputKeyDown={(e) =>
                        handleInputKeyDown(e, handleSubmitTurn)
                      }
                      onKeyPress={(digit) =>
                        setInputValue(inputValue + digit)
                      }
                      onBackspace={handleBackspace}
                      onEnter={handleSubmitTurn}
                      isScoreValid={isEnteredScoreValid}
                    />
                  )}
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
          lastPlayerId={previousPlayer?.id || ''}
        />
      )}
    </div>
  );
}
