import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { usePlayerGameContext } from "@/contexts/PlayerGameContext/usePlayerGameContext";
import {
  MAX_PLAYERS,
  MIN_PLAYERS,
} from "@/contexts/PlayerGameContext/PlayerGameContext";
import { useNavigation } from "@/hooks/useNavigation";

export default function ConfigureRealPlayersGame() {
  const { navigateToGameplay } = useNavigation();
  const {
    players,
    addPlayerInput,
    removePlayerInput,
    startRealPlayersGame,
    setPlayerName,
  } = usePlayerGameContext();

  const handleStartRealPlayersGame = () => {
    startRealPlayersGame();
    navigateToGameplay();
  };

  const isAnyEmptyName = players.some(({ name }) => name.trim() === "");
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Configure Real Players Game
              </div>
            </CardTitle>
            <CardDescription>
              Set up your multiplayer game. Game starts from 501 points and
              counts down to 0.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Enter Player Names
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Maximum {MAX_PLAYERS} players. Minimum {MIN_PLAYERS} players
                  required.
                </p>
              </div>

              {players.map((player, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor={`player-${index}`}>
                      Player {index + 1}
                    </Label>
                    <Input
                      id={`player-${index}`}
                      placeholder="Enter player name"
                      value={player.name}
                      onChange={(e) => setPlayerName(player.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  {players.length > MIN_PLAYERS && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePlayerInput(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              {players.length < MAX_PLAYERS && (
                <Button
                  disabled={players.length >= MAX_PLAYERS}
                  variant="outline"
                  className="w-full"
                  onClick={addPlayerInput}
                >
                  Add Player
                </Button>
              )}
            </div>

            <Button
              className="w-full"
              onClick={handleStartRealPlayersGame}
              disabled={isAnyEmptyName}
            >
              Start Game
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Game Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • The game starts with each player having{" "}
              <strong>501 points</strong>
            </p>
            <p>• Players take turns throwing darts and deducting their score</p>
            <p>
              • The first player to reach exactly <strong>0</strong> wins
            </p>
            <p>
              • If a player's score goes below 0, their turn is "busted" and the
              score is restored
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
