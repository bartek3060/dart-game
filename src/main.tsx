import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import { GameContextProvider } from './contexts/PlayerGameContext/PlayerGameContextProvider.tsx';
import { BotGameContextProvider } from './contexts/BotGameContext/BotGameContextProvider.tsx';
import StartPage from './pages/StartPage.tsx';
import ConfigureGame from './pages/ConfigureGame.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Toolbar from './components/core/Toolbar.tsx';
import { RouteResetListener } from './components/core/RouteResetListener.tsx';
import BotGamePlay from './pages/BotGamePlay.tsx';
import PlayerGamePlay from './pages/PlayerGamePlay.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameContextProvider>
      <BotGameContextProvider>
        <BrowserRouter>
          <RouteResetListener />
          <Toolbar />
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/configure-game" element={<ConfigureGame />} />
            <Route path="/gameplay" element={<PlayerGamePlay />} />
            <Route path="/bot-gameplay" element={<BotGamePlay />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </BotGameContextProvider>
    </GameContextProvider>
  </StrictMode>
);
