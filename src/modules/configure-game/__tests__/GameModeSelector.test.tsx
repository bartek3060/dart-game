import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameModeSelector from '../GameModeSelector';
import { GameMode } from '../GameModes.enum';

const mockOnGameModeChange = jest.fn();

describe('GameModeSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the tabs with both game modes', () => {
    render(
      <GameModeSelector
        gameMode={GameMode.REAL_PLAYERS}
        onGameModeChange={mockOnGameModeChange}
      />
    );

    expect(screen.getByText('Real Players')).toBeInTheDocument();
    expect(screen.getByText('Play vs Bot')).toBeInTheDocument();
  });

  it('shows icons for each mode', () => {
    render(
      <GameModeSelector
        gameMode={GameMode.REAL_PLAYERS}
        onGameModeChange={mockOnGameModeChange}
      />
    );

    // Check that icons are present (they have specific classes)
    const usersIcon = document.querySelector('.lucide-users');
    const botIcon = document.querySelector('.lucide-bot');

    expect(usersIcon).toBeInTheDocument();
    expect(botIcon).toBeInTheDocument();
  });

  it('calls onGameModeChange with REAL_PLAYERS when Real Players tab is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GameModeSelector
        gameMode={GameMode.BOT}
        onGameModeChange={mockOnGameModeChange}
      />
    );

    const realPlayersTab = screen.getByRole('tab', { name: /real players/i });
    await user.click(realPlayersTab);

    expect(mockOnGameModeChange).toHaveBeenCalledWith(GameMode.REAL_PLAYERS);
  });

  it('calls onGameModeChange with BOT when Play vs Bot tab is clicked', async () => {
    const user = userEvent.setup();
    render(
      <GameModeSelector
        gameMode={GameMode.REAL_PLAYERS}
        onGameModeChange={mockOnGameModeChange}
      />
    );

    const botTab = screen.getByRole('tab', { name: /play vs bot/i });
    await user.click(botTab);

    expect(mockOnGameModeChange).toHaveBeenCalledWith(GameMode.BOT);
  });

  it('sets the active tab based on gameMode prop', () => {
    render(
      <GameModeSelector
        gameMode={GameMode.BOT}
        onGameModeChange={mockOnGameModeChange}
      />
    );

    const botTab = screen.getByRole('tab', { name: /play vs bot/i });
    expect(botTab).toHaveAttribute('aria-selected', 'true');

    const realPlayersTab = screen.getByRole('tab', { name: /real players/i });
    expect(realPlayersTab).toHaveAttribute('aria-selected', 'false');
  });
});
