import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import { GameContextProvider } from './contexts/PlayerGameContext/PlayerGameContextProvider.tsx';
import StartPage from './pages/StartPage.tsx';
import ConfigureGame from './pages/ConfigureGame.tsx';
import GamePlay from './pages/GamePlay.tsx';
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Toolbar from './components/core/Toolbar.tsx';
import { RouteResetListener } from './components/core/RouteResetListener.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameContextProvider>
      <BrowserRouter>
        <RouteResetListener />
        <Toolbar />
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/configure-game" element={<ConfigureGame />} />
          <Route path="/gameplay" element={<GamePlay />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </GameContextProvider>
  </StrictMode>
);
