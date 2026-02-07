import { RulesCard } from "./RulesCard";
import { Header } from "@/games/checkers/components/Header";

import { motion, AnimatePresence } from "framer-motion";

const RULES = [
  {
    title: "Цель игры",
    description:
      "Захватить все шашки соперника или заблокировать их, чтобы он не мог сделать ход."
  },
  {
    title: "Ход игрока",
    description:
      "Игрок делает один ход за раз, двигая шашку по диагонали только вперёд."
  },
  {
    title: "Побивание (обязательный ход)",
    description:
      "Если можно побить шашку соперника, ход обязательный. Можно бить несколько шашек за один ход. Побивать разрешается в любом направлении, но обычные ходы всегда только вперёд."
  },
  {
    title: "Шашка в тупике",
    description:
      "Если шашка оказалась в тупике и не может ходить, она остаётся на доске, но больше не участвует в игре."
  },
  {
    title: "Конец игры",
    description:
      "Игра заканчивается, когда у одного игрока не остаётся шашек или нет возможных ходов."
  }
];

export const RulesPage = () => {
  return (
    <div className="relative h-screen flex flex-col">
      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/rooms-bg.webp"
        alt="Фон шашек"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />

      {/* ===== Полупрозрачный градиент сверху ===== */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40 -z-9"></div>

      <Header title="Правила игры" />

      <div className="relative flex-1 bg-gradient-to-br from-blue-700/10 via-purple-700/10 to-indigo-800/10 px-4 md:px-6 pt-8">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">

          {/* Заголовок */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Как играть в русские шашки
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-[17px] font-semibold">
              Коротко и по делу — основные правила, чтобы ты сразу мог ворваться в игру.
            </p>
          </div>
          <AnimatePresence>
            {RULES.map((rule, idx) => (
              <motion.div
                key={`rule-${idx}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: idx * 0.12, duration: 0.2, ease: "easeInOut" }}>
                <RulesCard
                  title={rule.title}
                  description={rule.description}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
