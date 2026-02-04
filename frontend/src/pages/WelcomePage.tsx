import { useNavigate } from "react-router-dom";
import { AppButton } from "@/components/ui/appButton";

export const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen relative overflow-hidden flex items-center justify-center px-4">
      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/splashscreen-bg.webp"
        alt="Фон шашек"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ===== Полупрозрачный градиент сверху ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40"></div>

      {/* ===== Контент ===== */}
      <div className="relative z-10 flex flex-col items-center text-center space-y-8">
        {/* Заголовок */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white/95 leading-tight">
          Шашки <br />
          <span className="text-green-500">Online</span>
        </h1>

        {/* Кнопки */}
        <div className="flex flex-col md:flex-row gap-4">
          <AppButton variant="primary" onClick={() => navigate("/rules")}>
            Правила игры
          </AppButton>
          <AppButton variant="accent" onClick={() => navigate("/leaderboard")}>
            Рекорды
          </AppButton>
          <AppButton variant="secondary" onClick={() => navigate("/rooms")}>
            Играть
          </AppButton>
        </div>
      </div>
    </div>
  );
};
