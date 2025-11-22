import { Input } from '@/components/ui/input';
import { Keyboard } from '@/modules/game/Keyboard';

interface ScoreInputProps {
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onKeyPress: (digit: string) => void;
    onBackspace: () => void;
    onEnter: () => void;
    isScoreValid: boolean;
}

export const ScoreInput = ({
    inputValue,
    onInputChange,
    onInputKeyDown,
    onKeyPress,
    onBackspace,
    onEnter,
    isScoreValid,
}: ScoreInputProps) => {
    return (
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
                    onChange={onInputChange}
                    onKeyDown={onInputKeyDown}
                    placeholder="Enter value 0-180"
                    className="flex-1"
                />
            </div>
            <Keyboard
                onKeyPress={onKeyPress}
                onBackspace={onBackspace}
                onEnter={onEnter}
                className="mt-4"
                isScoreValid={isScoreValid}
            />
        </div>
    );
};
