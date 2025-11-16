import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Bot } from "lucide-react";
import { GameMode } from "./GameModes.enum";

interface GameModeSelectorProps {
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
}

export default function GameModeSelector({
  gameMode,
  onGameModeChange,
}: GameModeSelectorProps) {
  return (
    <Tabs
      value={gameMode}
      onValueChange={(value) => onGameModeChange(value as GameMode)}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          value={GameMode.REAL_PLAYERS}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          Real Players
        </TabsTrigger>
        <TabsTrigger value={GameMode.BOT} className="flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Play vs Bot
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
