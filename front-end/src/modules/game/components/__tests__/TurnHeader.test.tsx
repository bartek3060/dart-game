import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TurnHeader } from '../TurnHeader';
import { Player } from '@/contexts/shared/gameTypes';

describe('TurnHeader', () => {
    const humanPlayer: Player = {
        id: 'p1',
        name: 'Alice',
        score: 301,
        isCurrentPlayer: true,
        isBot: false,
        turns: [],
        isWinner: false,
    };

    const botPlayer: Player = {
        id: 'b1',
        name: 'Bot',
        score: 301,
        isCurrentPlayer: true,
        isBot: true,
        turns: [],
        isWinner: false,
    };

    it('renders human player header correctly', () => {
        render(
            <TurnHeader
                currentPlayer={humanPlayer}
                onDeleteTurn={jest.fn()}
                canDeleteTurn={false}
            />
        );

        expect(screen.getByText("Alice's Turn")).toBeInTheDocument();
        expect(screen.getByText('Enter your turn score')).toBeInTheDocument();
    });

    it('renders bot player header correctly', () => {
        render(
            <TurnHeader
                currentPlayer={botPlayer}
                onDeleteTurn={jest.fn()}
                canDeleteTurn={false}
            />
        );

        expect(screen.getByText("Bot's Turn")).toBeInTheDocument();
        expect(screen.getByText('Bot is thinking...')).toBeInTheDocument();
    });

    it('shows undo button when canDeleteTurn is true', () => {
        render(
            <TurnHeader
                currentPlayer={humanPlayer}
                onDeleteTurn={jest.fn()}
                canDeleteTurn={true}
            />
        );

        expect(screen.getByTestId('undo-icon')).toBeInTheDocument();
    });

    it('hides undo button when canDeleteTurn is false', () => {
        render(
            <TurnHeader
                currentPlayer={humanPlayer}
                onDeleteTurn={jest.fn()}
                canDeleteTurn={false}
            />
        );

        expect(screen.queryByTestId('undo-icon')).not.toBeInTheDocument();
    });

    it('calls onDeleteTurn when undo button is clicked', async () => {
        const mockOnDelete = jest.fn();
        const user = userEvent.setup();

        render(
            <TurnHeader
                currentPlayer={humanPlayer}
                onDeleteTurn={mockOnDelete}
                canDeleteTurn={true}
            />
        );

        await user.click(screen.getByTestId('undo-icon'));
        expect(mockOnDelete).toHaveBeenCalled();
    });
});
