import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const SplashScreenPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 7000); // 4 секунды

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Живой переливающийся градиент */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-600 animate-gradient-x"></div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 space-y-10">
        {/* Заголовок */}
        <motion.h1
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-extrabold text-white"
        >
          Шашки Русские Классические <span className="text-green-500">Online</span>
        </motion.h1>

        {/* Описание */}
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
          className="text-lg md:text-xl text-white max-w-xl"
        >
          Играйте с друзьями или против соперников онлайн. Классические русские шашки без дамок — быстрые, честные и увлекательные партии!
        </motion.p>

        {/* Изображение шашек */}
        <motion.img
          src="/images/draughts.webp"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="w-[30vw] max-w-xs md:max-w-md"
          alt="Шашки"
        />
      </div>
    </div>
  );
};
