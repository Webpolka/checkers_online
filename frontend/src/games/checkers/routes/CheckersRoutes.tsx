import { Routes, Route, Navigate } from "react-router-dom";
import { SplashScreenPage } from "@/games/checkers/pages/splash/SplashPage";
import { WelcomePage } from "@/games/checkers/pages/welcome/WelcomePage";
import { RoomsPage } from "@/games/checkers/pages/rooms/RoomsPage";
import { GamePage } from "@/games/checkers/pages/game/GamePage";
import { RulesPage } from "@/games/checkers/pages/rules/RulesPage";
import { LeaderBoardPage } from "@/games/checkers/pages/leaderboard/LeaderBoardPage";
import { NotFoundPage } from "@/games/checkers/pages/notfound/NotFoundPage";
import { QuickStartPage } from "@/games/checkers/pages/quickstart/QuickStartPage";

export const CheckersRoutes = () => {
  return (
    <Routes>
      <Route path="/checkers" element={<Navigate to="/checkers/splash" />} />
      <Route path="/checkers/splash" element={<SplashScreenPage />} />
      <Route path="/checkers/welcome" element={<WelcomePage />} />
      <Route path="/checkers/rules" element={<RulesPage />} />
      <Route path="/checkers/leaderboard" element={<LeaderBoardPage />} />
      <Route path="/checkers/quickstart" element={<QuickStartPage />} />
      <Route path="/checkers/rooms" element={<RoomsPage />} />
      <Route path="/checkers/rooms/game/:gameId" element={<GamePage />} />
      <Route path="/checkers/*" element={<NotFoundPage />} />
    </Routes>
  );
}

