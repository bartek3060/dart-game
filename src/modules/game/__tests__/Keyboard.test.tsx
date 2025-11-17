import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Keyboard } from '../Keyboard';

const mockOnKeyPress = jest.fn();
const mockOnBackspace = jest.fn();
const mockOnEnter = jest.fn();

describe('Keyboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all digit buttons', () => {
    render(
      <Keyboard
        onKeyPress={mockOnKeyPress}
        onBackspace={mockOnBackspace}
        onEnter={mockOnEnter}
      />
    );

    // Check digits 1-9
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }

    // Check 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders backspace and enter buttons', () => {
    render(
      <Keyboard
        onKeyPress={mockOnKeyPress}
        onBackspace={mockOnBackspace}
        onEnter={mockOnEnter}
      />
    );

    // Check that we have 12 buttons total (10 digits + backspace + enter)
    expect(screen.getAllByRole('button')).toHaveLength(12);
  });

  it('calls onKeyPress when digit buttons are clicked', async () => {
    const user = userEvent.setup();
    render(
      <Keyboard
        onKeyPress={mockOnKeyPress}
        onBackspace={mockOnBackspace}
        onEnter={mockOnEnter}
      />
    );

    const button5 = screen.getByText('5');
    await user.click(button5);

    expect(mockOnKeyPress).toHaveBeenCalledWith('5');
    expect(mockOnKeyPress).toHaveBeenCalledTimes(1);
  });

  it('calls onKeyPress with 0 when 0 button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Keyboard
        onKeyPress={mockOnKeyPress}
        onBackspace={mockOnBackspace}
        onEnter={mockOnEnter}
      />
    );

    const button0 = screen.getByText('0');
    await user.click(button0);

    expect(mockOnKeyPress).toHaveBeenCalledWith('0');
  });

  it('does not call callbacks when props are not provided', async () => {
    const user = userEvent.setup();
    render(<Keyboard />);

    const button1 = screen.getByText('1');
    await user.click(button1);

    // Should not throw error, just do nothing
    expect(mockOnKeyPress).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <Keyboard
        onKeyPress={mockOnKeyPress}
        onBackspace={mockOnBackspace}
        onEnter={mockOnEnter}
        className="custom-class"
      />
    );

    const keyboard = screen.getByText('1').closest('.custom-class');
    expect(keyboard).toBeInTheDocument();
  });
});
