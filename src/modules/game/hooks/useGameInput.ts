import { useState } from 'react';

export const useGameInput = () => {
    const [inputValue, setInputValue] = useState<string>('');

    const isEnteredScoreValid = !!(
        inputValue.length &&
        !isNaN(Number(inputValue)) &&
        Number(inputValue) >= 0 &&
        Number(inputValue) <= 180
    );

    const resetPlayerInput = () => {
        setInputValue('');
    };

    const handleInputChange = ({
        target,
    }: React.ChangeEvent<HTMLInputElement>): void => {
        const value = target.value;
        setInputValue(value);
    };

    const handleBackspace = () => {
        setInputValue((prevInput) => prevInput.slice(0, -1));
    };

    const handleInputKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        onSubmit: () => void
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit();
        } else if (e.key === 'Backspace' && inputValue === '') {
            e.preventDefault();
            handleBackspace();
        }
    };

    return {
        inputValue,
        setInputValue,
        isEnteredScoreValid,
        resetPlayerInput,
        handleInputChange,
        handleBackspace,
        handleInputKeyDown,
    };
};
