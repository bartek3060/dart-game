import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreInput } from '../ScoreInput';

// Mock Keyboard component since it's tested separately and might be complex
jest.mock('@/modules/game/Keyboard', () => ({
    Keyboard: ({
        onKeyPress,
        onBackspace,
        onEnter,
    }: {
        onKeyPress: (digit: string) => void;
        onBackspace: () => void;
        onEnter: () => void;
    }) => (
        <div data-testid="mock-keyboard">
            <button onClick={() => onKeyPress('1')}>1</button>
            <button onClick={onBackspace}>Backspace</button>
            <button onClick={onEnter}>Enter</button>
        </div>
    ),
}));

describe('ScoreInput', () => {
    const defaultProps = {
        inputValue: '',
        onInputChange: jest.fn(),
        onInputKeyDown: jest.fn(),
        onKeyPress: jest.fn(),
        onBackspace: jest.fn(),
        onEnter: jest.fn(),
        isScoreValid: false,
    };

    it('renders correctly', () => {
        render(<ScoreInput {...defaultProps} />);
        expect(screen.getByPlaceholderText('Enter value 0-180')).toBeInTheDocument();
        expect(screen.getByTestId('mock-keyboard')).toBeInTheDocument();
    });

    it('displays input value', () => {
        render(<ScoreInput {...defaultProps} inputValue="123" />);
        expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    });

    it('calls onInputChange when typing', async () => {
        const user = userEvent.setup();
        render(<ScoreInput {...defaultProps} />);

        const input = screen.getByPlaceholderText('Enter value 0-180');
        await user.type(input, '5');

        expect(defaultProps.onInputChange).toHaveBeenCalled();
    });

    it('calls onInputKeyDown when pressing keys in input', async () => {
        const user = userEvent.setup();
        render(<ScoreInput {...defaultProps} />);

        const input = screen.getByPlaceholderText('Enter value 0-180');
        await user.type(input, '{Enter}');

        expect(defaultProps.onInputKeyDown).toHaveBeenCalled();
    });

    it('calls keyboard handlers', async () => {
        const user = userEvent.setup();
        render(<ScoreInput {...defaultProps} />);

        await user.click(screen.getByText('1'));
        expect(defaultProps.onKeyPress).toHaveBeenCalledWith('1');

        await user.click(screen.getByText('Backspace'));
        expect(defaultProps.onBackspace).toHaveBeenCalled();

        await user.click(screen.getByText('Enter'));
        expect(defaultProps.onEnter).toHaveBeenCalled();
    });
});
