import { render, screen } from '@testing-library/react';
import { CurrentScore } from '../CurrentScore';

describe('CurrentScore', () => {
    it('renders score correctly', () => {
        render(<CurrentScore score={180} />);

        expect(screen.getByText('Current Score')).toBeInTheDocument();
        expect(screen.getByText('180')).toBeInTheDocument();
    });

    it('renders zero score', () => {
        render(<CurrentScore score={0} />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
