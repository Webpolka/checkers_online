import { useNavigate } from "react-router-dom";
import { useFullscreen } from "@/hooks/useFullScreen";

export const WelcomePage = () => {
  const navigate = useNavigate();
  const { openFullscreen } = useFullscreen();

  const quickstart = () => {
    openFullscreen();
    navigate("/quickstart")
  }

  const leaderboard = () => { 
    openFullscreen();
    navigate("/leaderboard")
  }

  const rules = () => {
    openFullscreen();
    navigate("/rules")
  }

  const rooms = () => {
    openFullscreen();
    navigate("/rooms")
  }

  return (
    <div className="relative h-screen w-screen relative overflow-hidden flex items-center justify-center px-4 pb-5">
      {/* ===== Фон ===== */}
      <img
        src="/images/splashscreen-bg.webp"
        alt="Фон"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* затемнение */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/50 to-indigo-800/70" />

      {/* ===== Центральный контейнер ===== */}
      <div className="relative z-10 w-full max-w-[900px]">

        {/* Заголовок */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Шашки <br />
            <span className="text-green-200">Online</span>
          </h1>
        </div>

        {/* ===== Основной блок ===== */}
        <div
          className="
          relative
          mx-auto
          rounded-[40px]
          border-4 border-white/30
          backdrop-blur-2xl
          bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 rounded-2xl p-4 
          shadow-lg shadow-black/60    
          p-5 md:p-7
        "
          style={{
            aspectRatio: "5 / 6",
            maxHeight: "70vh"
          }}
        >
          {/* внутренняя рамка */}
          <div className="absolute inset-0 rounded-[40px] border border-white/10 pointer-events-none" />

          {/* ===== Masonry сетка ===== */}
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">

            <MenuCard
              emoji="⚡"
              title="Быстрый старт"
              subtitle="Как начать играть"
              color="from-indigo-100 to-blue-600"
              onClick={quickstart}
            />

            <MenuCard
              emoji="📜"
              title="Правила"
              subtitle="Русские шашки"
              color="from-indigo-100 to-indigo-600"
              onClick={rules}
            />

            <MenuCard
              emoji="🏆"
              title="Рекорды"
              subtitle="Лучшие игроки"
              color="from-amber-100 to-orange-500"
              onClick={leaderboard}
            />

            <MenuCard
              emoji="🎮"
              title="Играть"
              subtitle="Комнаты и партии"
              color="from-green-300 to-green-600"
              onClick={rooms}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

type CardProps = {
  title: string;
  subtitle: string;
  color: string;
  emoji: string;
  onClick: () => void;
};
const MenuCard = ({ title, subtitle, color, emoji, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className="
        group relative cursor-pointer
        rounded-2xl
        overflow-hidden
        flex flex-col justify-items-start items-center
        py-[15%] px-5
       bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700
        border border-white/20
        shadow-lg shadow-black/60
        transition-all duration-300
        hover:scale-[1.03]
        hover:bg-white/15
      "
    >
      {/* Градиент glow */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br ${color}`}
        style={{ filter: "blur(50px)" }}
      />

      {/* Большой emoji фон по центру */}
      <div className="absolute inset-0 flex justify-center pb-[10%] items-end text-[12vh] opacity-20 group-hover:opacity-30 pointer-events-none">
        {emoji}
      </div>

      {/* Контент (текст) по центру */}
      <div className="relative z-10 flex flex-col gap-2 justify-center items-center text-center space-y-1">
        <div className="text-[20px] sm:text-2xl font-extrabold text-white leading-[1]">
          {title}
        </div>
        <div className="text-white/70 text-sm md:text-base font-semibold  leading-[1]">
          {subtitle}
        </div>
      </div>
    </div>
  );
};
