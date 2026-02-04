import { Routes, Route, Navigate } from "react-router-dom";
import { SplashScreenPage } from "./pages/SplashScreenPage";
import { WelcomePage } from "./pages/WelcomePage";
import { RoomsPage } from "./pages/Rooms/RoomsPage";
import { GamePage } from "./pages/Game/GamePage";
import { RulesPage } from "./pages/Rules/RulesPage";
import { LeaderBoardPage } from "./pages/LeaderBoard/LeaderBoardPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/splash" />} />
      <Route path="/splash" element={<SplashScreenPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/rules" element={<RulesPage />} />
      <Route path="/leaderboard" element={<LeaderBoardPage />} />
      <Route path="/rooms" element={<RoomsPage />} />
      <Route path="/rooms/game/:gameId" element={<GamePage />} />

      {/* Роут на все неизвестные пути */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
