import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const SplashScreenPage = () => {
  const navigate = useNavigate();

  // отдельная обработка кнопки назад
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // останавливаем всплытие, чтобы глобальный клик не сработал
    navigate("/");
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/chess-bg.webp"
        alt="Фон шашек"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* ===== Полупрозрачный градиент ===== */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/20 via-blue-600/20 to-indigo-700/20"></div>

      {/* ===== Кнопка назад ===== */}
      <button
        onClick={handleBackClick}
        className="absolute top-8 left-8 z-20 w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-md hover:bg-white/30 transition-colors cursor-pointer"
        aria-label="Назад"
      >
        <svg className="w-12 h-12 flex-shrink-0 text-white drop-shadow-md transition-transform duration-200 ">
          <use xlinkHref={`/sprite/sprite.svg#back`} />
        </svg>
      </button>

      {/* ===== Контент ===== */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-6 p-10 rounded-4xl">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-white/95 leading-tight"
        >
          Шахматы <br />
          <span className="text-green-400">Online</span>
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="text-lg md:text-xl text-white max-w-xl"
        >
          Играй в шахматы с друзьями или случайными соперниками. Продумывай каждый ход и побеждай в честных онлайн-матчах!
        </motion.p>

      </div>
    </div>
  );
};
