import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import ConfigureRealPlayersGame from '../modules/configure-game/ConfigureRealPlayersGame';
import ConfigureBotGame from '../modules/configure-game/ConfigureBotGame';
import GameModeSelector from '../modules/configure-game/GameModeSelector';
import { useState } from 'react';
import { GameMode } from '@/modules/configure-game/GameModes.enum';

export default function ConfigureGame() {
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.REAL_PLAYERS);

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Dart Game Configuration</CardTitle>
            <CardDescription>
              Select your game mode: Play with real players or against a bot.
              Game starts from 501 points and counts down to 0.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GameModeSelector
              gameMode={gameMode}
              onGameModeChange={setGameMode}
            />
          </CardContent>
        </Card>

        {gameMode === GameMode.REAL_PLAYERS ? (
          <ConfigureRealPlayersGame />
        ) : (
          <ConfigureBotGame />
        )}
      </div>
    </div>
  );
}
