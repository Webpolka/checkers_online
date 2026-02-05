import { Routes, Route, Navigate } from "react-router-dom";
import { SplashScreenPage } from "./pages/SplashScreenPage";
import { WelcomePage } from "./pages/WelcomePage";
import { RoomsPage } from "./pages/Rooms/RoomsPage";
import { GamePage } from "./pages/Game/GamePage";
import { RulesPage } from "./pages/Rules/RulesPage";
import { LeaderBoardPage } from "./pages/LeaderBoard/LeaderBoardPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { QuickStartPage } from "./pages/QuickStart";
import { usePreloadImages } from "./hooks/usePreloadImages";
import { PageLoader2 } from "./components/ui/page-loader-2";
import { motion } from "framer-motion";

export const App = () => {
  const imagesLoaded = usePreloadImages([
    "/images/rooms-bg.webp",
    "/images/splashscreen-bg.webp",
    "/images/game-bg.webp"
  ]);

  if (!imagesLoaded) return <PageLoader2 />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/splash" />} />
        <Route path="/splash" element={<SplashScreenPage />} />
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/rules" element={<RulesPage />} />
        <Route path="/leaderboard" element={<LeaderBoardPage />} />
        <Route path="/quickstart" element={<QuickStartPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/rooms/game/:gameId" element={<GamePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </motion.div>
  );
};
