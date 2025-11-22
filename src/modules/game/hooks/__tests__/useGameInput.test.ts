import { renderHook, act } from '@testing-library/react';
import { useGameInput } from '../useGameInput';

describe('useGameInput', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useGameInput());

        expect(result.current.inputValue).toBe('');
        expect(result.current.isEnteredScoreValid).toBe(false);
    });

    it('should update input value on change', () => {
        const { result } = renderHook(() => useGameInput());

        act(() => {
            result.current.handleInputChange({
                target: { value: '50' },
            } as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.inputValue).toBe('50');
        expect(result.current.isEnteredScoreValid).toBe(true);
    });

    it('should validate score correctly', () => {
        const { result } = renderHook(() => useGameInput());

        // Valid score
        act(() => {
            result.current.setInputValue('180');
        });
        expect(result.current.isEnteredScoreValid).toBe(true);

        // Invalid score (too high)
        act(() => {
            result.current.setInputValue('181');
        });
        expect(result.current.isEnteredScoreValid).toBe(false);

        // Invalid score (negative)
        act(() => {
            result.current.setInputValue('-1');
        });
        expect(result.current.isEnteredScoreValid).toBe(false);

        // Invalid score (not a number)
        act(() => {
            result.current.setInputValue('abc');
        });
        expect(result.current.isEnteredScoreValid).toBe(false);

        // Empty
        act(() => {
            result.current.setInputValue('');
        });
        expect(result.current.isEnteredScoreValid).toBe(false);
    });

    it('should handle backspace', () => {
        const { result } = renderHook(() => useGameInput());

        act(() => {
            result.current.setInputValue('123');
        });

        act(() => {
            result.current.handleBackspace();
        });

        expect(result.current.inputValue).toBe('12');
    });

    it('should reset input', () => {
        const { result } = renderHook(() => useGameInput());

        act(() => {
            result.current.setInputValue('100');
        });

        act(() => {
            result.current.resetPlayerInput();
        });

        expect(result.current.inputValue).toBe('');
    });

    it('should handle Enter key down', () => {
        const { result } = renderHook(() => useGameInput());
        const mockOnSubmit = jest.fn();
        const mockEvent = {
            key: 'Enter',
            preventDefault: jest.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>;

        act(() => {
            result.current.handleInputKeyDown(mockEvent, mockOnSubmit);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockOnSubmit).toHaveBeenCalled();
    });

    it('should handle Backspace key down when empty', () => {
        const { result } = renderHook(() => useGameInput());
        const mockOnSubmit = jest.fn();
        const mockEvent = {
            key: 'Backspace',
            preventDefault: jest.fn(),
        } as unknown as React.KeyboardEvent<HTMLInputElement>;

        // Ensure input is empty
        expect(result.current.inputValue).toBe('');

        // We can't easily spy on handleBackspace since it's internal, 
        // but we can check if preventDefault is called which happens in that branch
        act(() => {
            result.current.handleInputKeyDown(mockEvent, mockOnSubmit);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
});
