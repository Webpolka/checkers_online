import { Routes, Route, Navigate } from "react-router-dom"
import { RequireAuth } from "./RequireAuth"
import { CheckersRoutes } from "@/games/checkers/routes/CheckersRoutes"
import { AuthPage } from "@/pages/AuthPage"

export const AppRouter = () => {
  return (
    <Routes>

      {/* авторизация */}
      <Route path="/auth" element={<AuthPage />} />

      {/* ВСЁ остальное только после авторизации */}
      <Route element={<RequireAuth />}>

        {/* главная */}
        <Route path="/" element={<Navigate to="/checkers" />} />

        {/* шашки */}
        <Route path="/*" element={<CheckersRoutes />} />

      </Route>

    </Routes>
  )
}
