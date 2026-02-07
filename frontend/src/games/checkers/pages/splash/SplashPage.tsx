import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const SplashScreenPage = () => {
  const navigate = useNavigate();
  const [reverse, setReverse] = useState(false); // для обратной анимации
  const [started, setStarted] = useState(false); // для выхода со сплэша

  useEffect(() => {
    if (started) return; // если уже кликнули, таймеры не нужны

    // через 5.5 секунд запускаем обратную анимацию
    const reverseTimer = setTimeout(() => setReverse(true), 5500);

    // через 7 секунд автоматический переход
    const timer = setTimeout(() => {
      setStarted(true);
      navigate("/checkers/welcome");
    }, 7000);

    // клик по любой области страницы
    const handleClick = () => {
      if (started) return;
      clearTimeout(timer);
      clearTimeout(reverseTimer);
      setReverse(true);
      setStarted(true);
      navigate("/checkers/welcome");
    };

    document.addEventListener("click", handleClick);

    return () => {
      clearTimeout(timer);
      clearTimeout(reverseTimer);
      document.removeEventListener("click", handleClick);
    };
  }, [navigate, started]);


  // отдельная обработка кнопки назад
  const handleBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // останавливаем всплытие, чтобы глобальный клик не сработал
    navigate("/");
  };

  return (
    <AnimatePresence>
      {!started && (
        <div className="h-screen w-screen relative overflow-hidden flex items-center justify-center">
          {/* ===== Фоновое изображение ===== */}
          <img
            src="/images/splashscreen-bg.webp"
            alt="Фон шашек"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* ===== Полупрозрачный градиент сверху ===== */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 via-blue-600/30 to-indigo-700/30"></div>

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
          <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-6">
            <motion.h1
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: reverse ? -40 : 0, opacity: reverse ? 0 : 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-5xl md:text-6xl font-extrabold text-white/95 leading-tight"
            >
              Шашки Русские <br />
              <span className="text-green-500">Классические Online</span>
            </motion.h1>

            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: reverse ? 40 : 0, opacity: reverse ? 0 : 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              className="text-lg md:text-xl text-white/90 max-w-xl"
            >
              Играйте с друзьями или против соперников онлайн. Классические русские шашки без дамок — быстрые, честные и увлекательные партии!
            </motion.p>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
