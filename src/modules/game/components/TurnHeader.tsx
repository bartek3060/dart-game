import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Undo2, Bot } from 'lucide-react';
import type { Player } from '@/contexts/shared/gameTypes';

interface TurnHeaderProps {
    currentPlayer: Player;
    onDeleteTurn: () => void;
    canDeleteTurn: boolean;
}

export const TurnHeader = ({
    currentPlayer,
    onDeleteTurn,
    canDeleteTurn,
}: TurnHeaderProps) => {
    return (
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
                        {currentPlayer.isBot ? 'Bot is thinking...' : 'Enter your turn score'}
                    </CardDescription>
                </div>
                {canDeleteTurn && (
                    <Button
                        data-testid="undo-icon"
                        variant="ghost"
                        size="sm"
                        onClick={onDeleteTurn}
                        title="Delete last turn"
                    >
                        <Undo2 className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </CardHeader>
    );
};
