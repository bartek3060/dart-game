import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';
import type { Player } from '@/contexts/shared/gameTypes';

interface PlayerScoreTabsProps {
    players: Player[];
    activePlayerId: string;
}

export const PlayerScoreTabs = ({
    players,
    activePlayerId,
}: PlayerScoreTabsProps) => {
    return (
        <div className="sticky top-16 z-10 bg-background py-2">
            <Tabs value={activePlayerId} className="w-full overflow-x-scroll">
                <TabsList className="flex w-full">
                    {players.map((player) => (
                        <TabsTrigger
                            data-testid="player-tab-score"
                            key={player.id}
                            value={player.id}
                            className="relative flex flex-col items-center gap-1 flex-1 min-w-[100px]"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                    {player.isBot ? (
                                        <Bot className="w-3 h-3" />
                                    ) : (
                                        <span className="w-3 h-3 rounded-full bg-primary" />
                                    )}
                                    <span className="text-xs font-medium">{player.name}</span>
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
    );
};
