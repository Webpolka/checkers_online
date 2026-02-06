import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFullscreen } from "@/hooks/useFullScreen";

export const SplashScreenPage = () => {
  const [started, setStarted] = useState(false);
  const { openFullscreen } = useFullscreen();
  const navigate = useNavigate();

  const handleStart = () => {
    setStarted(true);          // скрываем сплэш
    openFullscreen?.();        // вызываем fullscreen
    navigate("/welcome");      // переход на страницу Welcome
  };

  if (started) return null;    // пока сплэш скрыт, ничего не рендерим

  return (
    <div className="relative h-screen w-screen overflow-hidden flex items-center justify-center">
      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/splashscreen-bg.webp"
        alt="Фон шашек"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* ===== Полупрозрачный градиент ===== */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40"></div>

      {/* ===== Контент ===== */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-6">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-white/95 leading-tight"
        >
          Шашки Русские <br />
          <span className="text-green-500">Классические Online</span>
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="text-lg md:text-xl text-white/90 max-w-xl"
        >
          Играйте с друзьями или против соперников онлайн. Классические русские шашки без дамок — быстрые, честные и увлекательные партии!
        </motion.p>

        {/* ===== Кнопка “Начать” ===== */}
        <motion.button
          onClick={handleStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 bg-gradient-to-r from-green-400 via-green-500 to-blue-500
                     text-white font-bold text-lg md:text-xl
                     px-6 py-3 rounded-xl shadow-xl shadow-black/40
                     transition-transform duration-200"
        >
          Начать
        </motion.button>
      </div>
    </div>
  );
};
