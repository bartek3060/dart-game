import { useNavigate } from 'react-router';

export function useNavigation() {
  const navigate = useNavigate();

  const navigateToConfigureGame = () => {
    navigate('/configure-game');
  };

  const navigateToSignIn = () => {
    navigate('/login');
  };

  const navigateToRegister = () => {
    navigate('/register');
  };

  const navigateToGameplay = () => {
    navigate('/gameplay');
  };

  return {
    navigateToConfigureGame,
    navigateToSignIn,
    navigateToRegister,
    navigateToGameplay,
  };
}
