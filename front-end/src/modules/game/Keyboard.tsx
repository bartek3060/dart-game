import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Delete, CheckCircle } from 'lucide-react';

interface KeyboardProps {
  isScoreValid: boolean;
  onKeyPress?: (digit: string) => void;
  onBackspace?: () => void;
  onEnter?: () => void;
  className?: string;
}

const digits = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
];

export function Keyboard({
  onKeyPress,
  onBackspace,
  onEnter,
  className,
  isScoreValid,
}: KeyboardProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {digits.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-2 justify-center">
          {row.map((digit) => (
            <Button
              data-testid="digit-button"
              key={digit}
              onClick={() => onKeyPress?.(digit)}
              variant="outline"
              size="lg"
              className="w-16 h-16 text-lg font-semibold"
            >
              {digit}
            </Button>
          ))}
        </div>
      ))}
      <div className="flex gap-2 justify-center mt-2">
        <Button
          data-testid="backspace-button"
          onClick={onBackspace}
          variant="destructive"
          size="lg"
          className="w-16 h-16 text-lg font-semibold"
        >
          <Delete className="w-6 h-6" />
        </Button>
        <Button
          data-testid="digit-button"
          onClick={() => onKeyPress?.('0')}
          variant="outline"
          size="lg"
          className="w-16 h-16 text-lg font-semibold"
        >
          0
        </Button>
        <Button
          data-testid="keyboard-submit"
          disabled={!isScoreValid}
          onClick={onEnter}
          variant="default"
          size="lg"
          className="w-16 h-16 text-lg font-semibold"
        >
          <CheckCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
