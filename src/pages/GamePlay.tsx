import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Undo2 } from "lucide-react";
import { usePlayerGameContext } from "@/contexts/PlayerGameContext/usePlayerGameContext";
import { useNavigation } from "@/hooks/useNavigation";
import { useEffect, useState } from "react";
import { Keyboard } from "@/modules/game/Keyboard";
import { GameFinishedModal } from "@/modules/game/GameFinishedModal";

export default function GamePlay() {
  const { navigateToConfigureGame } = useNavigation();
  const { players, addPlayerTurn, deleteLastPlayerTurn, resetAndStartGame } =
    usePlayerGameContext();
  const [inputValue, setInputValue] = useState<string>("");

  const currentPlayer = players.find(({ isCurrentPlayer }) => isCurrentPlayer);
  const activePlayerId = currentPlayer?.id || "";
  const currentPlayerIndex = players.findIndex(
    ({ isCurrentPlayer }) => isCurrentPlayer
  );
  const previousPlayerId =
    players[
      currentPlayerIndex > 0 ? currentPlayerIndex - 1 : players.length - 1
    ].id;
  const winner = players.find(({ score }) => score === 0);
  const gameFinished = !!winner;

  useEffect(() => {
    if (!currentPlayer) {
      return navigateToConfigureGame();
    }
  }, [currentPlayer, navigateToConfigureGame]);

  const resetPlayerInput = () => {
    setInputValue("");
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
    if (e.key === "Enter") {
      e.preventDefault();
      const num = parseInt(inputValue);
      if (!isNaN(num)) {
        addPlayerTurn(activePlayerId, num);
        resetPlayerInput();
      }
    } else if (e.key === "Backspace" && inputValue === "") {
      e.preventDefault();
      handleBackspace();
    }
  };

  const handleSubmitTurn = () => {
    if (inputValue.length > 0) {
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
              <Tabs value={activePlayerId}>
                <div className="sticky top-16 z-10 bg-background py-2">
                  <TabsList
                    className="grid w-full gap-2"
                    style={{
                      gridTemplateColumns: `repeat(${Math.min(
                        players.length,
                        6
                      )}, 1fr)`,
                    }}
                  >
                    {players.map((player) => (
                      <TabsTrigger
                        key={player.id}
                        value={player.id}
                        className="relative flex flex-col items-center gap-1"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium">
                            {player.name}
                          </span>
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
                </div>

                {players.map((player) => (
                  <TabsContent key={player.id} value={player.id}>
                    <Card className="bg-muted/50 border-0">
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Current Score
                            </p>
                            <p className="text-4xl font-bold">{player.score}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {currentPlayer && (
              <Card className="bg-linear-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {currentPlayer.name}'s Turn
                      </CardTitle>
                      <CardDescription>Enter your turn score</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteLastPlayerTurn(previousPlayerId)}
                      title="Delete last turn"
                    >
                      <Undo2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Enter throws value (0-180) or use the keyboard below
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="60"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        placeholder="Enter value 0-180"
                        className="flex-1"
                        autoFocus
                      />
                    </div>
                    <Keyboard
                      onKeyPress={(digit) => setInputValue(inputValue + digit)}
                      onBackspace={handleBackspace}
                      onEnter={handleSubmitTurn}
                      className="mt-4"
                    />
                  </div>
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
