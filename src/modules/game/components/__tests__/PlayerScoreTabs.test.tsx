import { render, screen } from '@testing-library/react';
import { PlayerScoreTabs } from '../PlayerScoreTabs';
import { Player } from '@/contexts/shared/gameTypes';

describe('PlayerScoreTabs', () => {
    const mockPlayers: Player[] = [
        {
            id: 'p1',
            name: 'Human',
            score: 301,
            isCurrentPlayer: true,
            isBot: false,
            turns: [],
            isWinner: false,
        },
        {
            id: 'b1',
            name: 'Robot',
            score: 501,
            isCurrentPlayer: false,
            isBot: true,
            turns: [],
            isWinner: false,
        },
    ];

    it('renders all players', () => {
        render(<PlayerScoreTabs players={mockPlayers} activePlayerId="p1" />);

        expect(screen.getByText('Human')).toBeInTheDocument();
        expect(screen.getByText('Robot')).toBeInTheDocument();
        expect(screen.getByText('301')).toBeInTheDocument();
        expect(screen.getByText('501')).toBeInTheDocument();
    });

    it('shows active badge for current player', () => {
        render(<PlayerScoreTabs players={mockPlayers} activePlayerId="p1" />);

        // "Active" badge should be visible for Human
        // We can check if "Active" text is present. 
        // Since there's only one active player, getting by text should work.
        expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('renders bot icon for bot players', () => {
        render(<PlayerScoreTabs players={mockPlayers} activePlayerId="p1" />);

        // Lucide icons usually render as SVGs. 
        // We can check for the lucide-bot class or just existence of SVG in the bot tab.
        // Or we can check if the span for human color exists and bot doesn't have it.

        // Human has the span
        const humanTab = screen.getByText('Human').closest('button');
        expect(humanTab?.querySelector('.bg-primary.rounded-full')).toBeInTheDocument();

        // Bot should have an SVG (Bot icon)
        const botTab = screen.getByText('Robot').closest('button');
        expect(botTab?.querySelector('svg')).toBeInTheDocument();
    });
});
