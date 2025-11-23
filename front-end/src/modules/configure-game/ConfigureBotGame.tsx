import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bot } from 'lucide-react';
import { useBotGameContext } from '@/contexts/BotGameContext/BotGameContext';
import { BotDifficulty } from '@/contexts/BotGameContext/botGameTypes';
import { useNavigation } from '@/hooks/useNavigation';

const getDifficultyDescription = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'Random throws between 0-60 points';
    case 'medium':
      return 'Mostly good throws with some variability';
    case 'hard':
      return 'Mostly excellent throws with strategic play';
    case 'expert':
      return 'Strategic and highly accurate throws';
    default:
      return 'Bot difficulty level';
  }
};

export default function ConfigureBotGame() {
  const { navigateToBotGameplay } = useNavigation();
  const {
    players,
    botDifficulty,
    setBotDifficulty,
    setPlayerName,
    startBotGame,
  } = useBotGameContext();

  const handleStartBotGame = () => {
    startBotGame();
    navigateToBotGameplay();
  };

  const isPlayerNameEmpty = players[0]?.name.trim() === '';

  const player = players[0]; // Only need the first player (human)

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5" />
                Configure Bot Game
              </div>
            </CardTitle>
            <CardDescription>
              Play against a bot. Game starts from 501 points and counts down to
              0.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Enter Your Name</h3>
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <Label htmlFor="player-0">Your Name</Label>
                    <Input
                      id="player-0"
                      placeholder="Enter your name"
                      value={player.name}
                      onChange={(e) => setPlayerName(player.id, e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Choose Bot Difficulty
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the bot's difficulty level
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.values(BotDifficulty).map((difficulty) => (
                    <Card
                      key={difficulty}
                      className={`cursor-pointer transition-colors ${
                        botDifficulty === difficulty
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-muted-foreground/50'
                      }`}
                      onClick={() => setBotDifficulty(difficulty)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">
                            {difficulty}
                          </h4>
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              botDifficulty === difficulty
                                ? 'border-primary bg-primary'
                                : 'border-muted-foreground'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {getDifficultyDescription(difficulty)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleStartBotGame}
              disabled={isPlayerNameEmpty}
            >
              Start Game vs{' '}
              {botDifficulty.charAt(0).toUpperCase() + botDifficulty.slice(1)}{' '}
              Bot
            </Button>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Game Rules</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              • The game starts with each player having{' '}
              <strong>501 points</strong>
            </p>
            <p>
              • You and the bot take turns throwing darts and deducting your
              score
            </p>
            <p>
              • The first to reach exactly <strong>0</strong> wins
            </p>
            <p>
              • If a player's score goes below 0, their turn is "busted" and the
              score is restored
            </p>
            <p>• Bot difficulty affects how accurately the bot plays</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
