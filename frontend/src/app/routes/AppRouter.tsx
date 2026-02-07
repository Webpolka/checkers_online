// src/AppRouter.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { LobbyPage } from "@/pages/LobbyPage";
import { RequireAuth } from "./RequireAuth";
import { AuthPage } from "@/pages/AuthPage";

// шашки
import { SplashScreenPage as CheckersSplashScreenPage } from "@/games/checkers/pages/splash/SplashPage";
import { WelcomePage as CheckersWelcomePage } from "@/games/checkers/pages/welcome/WelcomePage";
import { RoomsPage as CheckersRoomsPage } from "@/games/checkers/pages/rooms/RoomsPage";
import { GamePage as CheckersGamePage } from "@/games/checkers/pages/game/GamePage";
import { RulesPage as CheckersRulesPage } from "@/games/checkers/pages/rules/RulesPage";
import { LeaderBoardPage as CheckersLeaderBoardPage } from "@/games/checkers/pages/leaderboard/LeaderBoardPage";
import { NotFoundPage as CheckersNotFoundPage } from "@/games/checkers/pages/notfound/NotFoundPage";
import { QuickStartPage as CheckersQuickStartPage } from "@/games/checkers/pages/quickstart/QuickStartPage";
// Layout для шашек
const CheckersLayout: React.FC = () => <Outlet />;

// шахматы
import { SplashScreenPage as ChessSplashScreenPage } from "@/games/chess/pages/splash/SplashPage";
// Layout для шахмат
const ChessLayout: React.FC = () => <Outlet />;

export const AppRouter: React.FC = () => {
  return (
    <Routes>

      {/* Страница авторизации */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Всё остальное только после авторизации */}
      <Route element={<RequireAuth />}>

        {/* Главная страница */}
        <Route path="/" element={<LobbyPage />} />

        {/* Шашки */}
        <Route path="/checkers" element={<CheckersLayout />}>
          <Route index element={<Navigate to="splash" replace />} />
          <Route path="splash" element={<CheckersSplashScreenPage />} />
          <Route path="welcome" element={<CheckersWelcomePage />} />
          <Route path="rules" element={<CheckersRulesPage />} />
          <Route path="leaderboard" element={<CheckersLeaderBoardPage />} />
          <Route path="quickstart" element={<CheckersQuickStartPage />} />
          <Route path="rooms" element={<CheckersRoomsPage />} />
          <Route path="rooms/game/:gameId" element={<CheckersGamePage />} />
          <Route path="*" element={<CheckersNotFoundPage />} />
        </Route>

        {/* Шахматы */}
        <Route path="/chess" element={<ChessLayout />}>
          <Route index element={<Navigate to="splash" replace />} />
          <Route path="splash" element={<ChessSplashScreenPage />} />
        </Route>
      </Route>

    </Routes>
  );
};
