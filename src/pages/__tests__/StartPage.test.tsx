import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartPage from '../StartPage';

// Mock the useNavigation hook
const mockNavigateToConfigureGame = jest.fn();
const mockNavigateToSignIn = jest.fn();
const mockNavigateToRegister = jest.fn();

jest.mock('@/hooks/useNavigation', () => ({
  useNavigation: () => ({
    navigateToConfigureGame: mockNavigateToConfigureGame,
    navigateToSignIn: mockNavigateToSignIn,
    navigateToRegister: mockNavigateToRegister,
  }),
}));

describe('StartPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the start page with title and description', () => {
    render(<StartPage />);

    expect(screen.getByText('Welcome to Dart')).toBeInTheDocument();
    expect(screen.getByText(/Test your throwing skills/)).toBeInTheDocument();
  });

  it('displays feature cards', () => {
    render(<StartPage />);

    expect(screen.getByText('Fast Paced')).toBeInTheDocument();
    expect(screen.getByText('Competitive')).toBeInTheDocument();
    expect(screen.getByText('Engaging')).toBeInTheDocument();
    expect(screen.getByText('Trackable')).toBeInTheDocument();
  });

  it('calls navigateToConfigureGame when Start Playing button is clicked', async () => {
    const user = userEvent.setup();
    render(<StartPage />);

    const startButton = screen.getByRole('button', { name: /start playing/i });
    await user.click(startButton);

    expect(mockNavigateToConfigureGame).toHaveBeenCalledTimes(1);
  });

  it('calls navigateToSignIn when Sign In button is clicked', async () => {
    const user = userEvent.setup();
    render(<StartPage />);

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(signInButton);

    expect(mockNavigateToSignIn).toHaveBeenCalledTimes(1);
  });

  it('calls navigateToRegister when Create Account button is clicked', async () => {
    const user = userEvent.setup();
    render(<StartPage />);

    const registerButton = screen.getByRole('button', {
      name: /create account/i,
    });
    await user.click(registerButton);

    expect(mockNavigateToRegister).toHaveBeenCalledTimes(1);
  });

  it('displays footer links', () => {
    render(<StartPage />);

    expect(screen.getByText(/Terms of Service/)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/)).toBeInTheDocument();
  });
});
