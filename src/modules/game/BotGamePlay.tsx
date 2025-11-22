import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Undo2, Bot, Loader2 } from 'lucide-react';
import { useBotGameContext } from '@/contexts/BotGameContext/BotGameContext';
import { useNavigation } from '@/hooks/useNavigation';
import { useEffect, useState, useCallback } from 'react';
import { Keyboard } from '@/modules/game/Keyboard';
import { GameFinishedModal } from '@/modules/game/GameFinishedModal';
import { generateBotThrow } from '@/modules/game/generateBotThrows';

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
  const [inputValue, setInputValue] = useState<string>('');

  const isEnteredScoreValid = !!(
    inputValue.length &&
    !isNaN(Number(inputValue)) &&
    Number(inputValue) >= 0 &&
    Number(inputValue) <= 180
  );

  const currentPlayer = players.find(({ isCurrentPlayer }) => isCurrentPlayer);
  const activePlayerId = currentPlayer?.id || '';
  const currentPlayerIndex = players.findIndex(
    ({ isCurrentPlayer }) => isCurrentPlayer
  );
  const previousPlayerIndex =
    currentPlayerIndex > 0 ? currentPlayerIndex - 1 : players.length - 1;
  const previousPlayer = players[previousPlayerIndex];
  const winner = players.find(({ score }) => score === 0);
  const gameFinished = !!winner;

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

  const resetPlayerInput = () => {
    setInputValue('');
  };

  const handleInputChange = ({
    target,
  }: React.ChangeEvent<HTMLInputElement>): void => {
    const value = target.value;
    setInputValue(value);
  };

  const handleBackspace = () => {
    setInputValue((prevInput) => prevInput.slice(0, -1));
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isEnteredScoreValid && !currentPlayer.isBot) {
        const num = parseInt(inputValue);
        addPlayerTurn(activePlayerId, num);
        resetPlayerInput();
      }
    } else if (e.key === 'Backspace' && inputValue === '') {
      e.preventDefault();
      handleBackspace();
    }
  };

  const handleSubmitTurn = () => {
    if (inputValue.length > 0 && !currentPlayer.isBot) {
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
      previousPlayer && !previousPlayer.isBot && previousPlayer.turns.length > 0
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
              <div className="sticky top-16 z-10 bg-background py-2">
                <Tabs value={activePlayerId}>
                  <TabsList className=" flex">
                    {players.map((player) => (
                      <TabsTrigger
                        data-testid="player-tab-score"
                        key={player.id}
                        value={player.id}
                        className="relative flex flex-col items-center gap-1 flex-1"
                      >
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {player.isBot ? (
                              <Bot className="w-3 h-3" />
                            ) : (
                              <span className="w-3 h-3 rounded-full bg-primary" />
                            )}
                            <span className="text-xs font-medium">
                              {player.name}
                            </span>
                          </div>
                          {player.isCurrentPlayer && (
                            <Badge variant="default" className="h-5 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold">
                          {player.score}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
              <Card className="bg-muted/50 border-0">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Current Score
                      </p>
                      <p className="text-4xl font-bold">
                        {currentPlayer.score}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {currentPlayer && (
              <Card
                className={`${currentPlayer.isBot
                  ? 'bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20'
                  : 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20'
                  }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {currentPlayer.isBot ? (
                          <>
                            <Bot className="w-5 h-5" />
                            Bot's Turn
                          </>
                        ) : (
                          <>
                            <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                              <span className="w-2 h-2 bg-background rounded-full" />
                            </span>
                            {currentPlayer.name}'s Turn
                          </>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {currentPlayer.isBot
                          ? 'Bot is thinking...'
                          : 'Enter your turn score'}
                      </CardDescription>
                    </div>
                    {canDeleteTurn() && (
                      <Button
                        data-testid="undo-icon"
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteLastPlayerTurn(previousPlayer.id)}
                        title="Delete last turn"
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
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
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground">
                        Enter throws value (0-180) or use the keyboard below
                      </p>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="180"
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleInputKeyDown}
                          placeholder="Enter value 0-180"
                          className="flex-1"
                        />
                      </div>
                      <Keyboard
                        onKeyPress={(digit) =>
                          setInputValue(inputValue + digit)
                        }
                        onBackspace={handleBackspace}
                        onEnter={handleSubmitTurn}
                        className="mt-4"
                        isScoreValid={isEnteredScoreValid}
                      />
                    </div>
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
          lastPlayerId={previousPlayer.id}
        />
      )}
    </div>
  );
}
