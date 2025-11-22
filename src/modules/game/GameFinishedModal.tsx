import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Undo2 } from 'lucide-react';
import type { Player } from '@/contexts/PlayerGameContext/gameTypes';

interface GameFinishedModalProps {
  open: boolean;
  winner: Player;
  players: Player[];
  onStartAgain: () => void;
  onConfigureNewGame: () => void;
  onDeleteLastTurn: (playerId: string) => void;
  lastPlayerId?: string;
}

export function GameFinishedModal({
  open,
  winner,
  players,
  onStartAgain,
  onConfigureNewGame,
  onDeleteLastTurn,
}: GameFinishedModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            🎉 Game Finished! 🎉
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {winner && (
            <div className="text-center space-y-2">
              <div className="text-lg font-semibold text-foreground">
                {winner.name} wins!
              </div>
              <div className="text-sm text-muted-foreground">
                Final score: <strong>{winner.score}</strong>
              </div>
            </div>
          )}
          <div>
            <h3 className="text-sm font-semibold mb-3">Final Scores</h3>
            <div className="space-y-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg flex justify-between items-center ${
                    player.id === winner?.id
                      ? 'bg-primary/10 border border-primary'
                      : 'bg-muted'
                  }`}
                >
                  <span className="font-medium">{player.name}</span>
                  <span
                    className={`text-lg font-semibold ${
                      player.id === winner?.id ? 'text-primary' : ''
                    }`}
                  >
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="grid grid-cols-3 gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteLastTurn(winner.id)}
            title="Delete last turn"
            className="col-start-1"
          >
            <Undo2 data-testid="modal-undo-button" className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={onStartAgain}>
            Start Again
          </Button>
          <Button variant="default" onClick={onConfigureNewGame}>
            Configure Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
