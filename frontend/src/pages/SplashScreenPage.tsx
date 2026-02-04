import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const SplashScreenPage = () => {
  const navigate = useNavigate();
  const [reverse, setReverse] = useState(false); // для обратной анимации

  useEffect(() => {
    // Через 6 секунд начинаем обратную анимацию (таймер 7 сек)
    const reverseTimer = setTimeout(() => {
      setReverse(true);
    }, 5500);

    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 7000);

    return () => {
      clearTimeout(timer);
      clearTimeout(reverseTimer);
    };
  }, [navigate]);

  return (
    <div className="h-screen w-screen relative overflow-hidden flex items-center justify-center">
      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/splashscreen-bg.webp"
        alt="Фон шашек"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ===== Полупрозрачный градиент сверху ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40"></div>

      {/* ===== Контент ===== */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-6">
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: reverse ? -40 : 0, opacity: reverse ? 0 : 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-white/95 leading-tight"
        >
          Шашки Русские <br />
          <span className="text-green-500">Классические Online</span>
        </motion.h1>

        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: reverse ? 40 : 0, opacity: reverse ? 0 : 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="text-lg md:text-xl text-white/90 max-w-xl"
        >
          Играйте с друзьями или против соперников онлайн. Классические русские шашки без дамок — быстрые, честные и увлекательные партии!
        </motion.p>
      </div>
    </div>
  );
};
