import { RulesCard } from "@/games/checkers/pages/rules/RulesCard";
import { Header } from "@/games/checkers/components/Header";

import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    title: "1. Зайди в раздел «Игра»",
    description:
      "После входа откроется раздел игровых комнат. Здесь создаются все партии и именно отсюда начинается любая игра."
  },
  {
    title: "2. Создай комнату",
    description:
      "Нажми «Создать комнату» и выбери режим: PvP (против игрока онлайн), PvE (против бота) или EvE (бот против бота). Режим комнаты нельзя изменить после создания — все игры внутри неё будут только выбранного типа."
  },
  {
    title: "3. Как работают комнаты",
    description:
      "После создания ты автоматически попадёшь в комнату. Если комната PvP — она видна другим игрокам, пока в ней один человек. Когда в комнате уже два игрока, она скрывается из списка. PvE-комнаты не отображаются другим игрокам. В EvE-комнаты никто не может зайти — только создатель может наблюдать за игрой ботов, но карточки игр видны всем."
  },
  {
    title: "4. Создание и вход в игру",
    description:
      "Создание комнаты не запускает игру автоматически. Внутри комнаты нужно создать игру и нажать «Присоединиться». Только после присоединения игроков начинается партия."
  },
  {
    title: "5. Во время игры",
    description:
      "Игру можно покинуть в любой момент кнопкой выхода возле домика. Партия приостановится и останется доступной — ты сможешь вернуться в неё позже, если не закроешь вкладку браузера. Можно иметь несколько активных игр и комнат одновременно."
  },
  {
    title: "6. Комнаты и удаление",
    description:
      "Игры можно удалять и создавать заново без ограничений. Если оба игрока выходят из комнаты, она автоматически удаляется через некоторое время. Пустые комнаты не хранятся. Если игрок закрыл вкладку браузера, он считается покинувшим комнату. Комнаты живут пока в них есть хотя бы игрок."
  }
];


export const QuickStartPage = () => {
  return (
    <div className="relative h-screen flex flex-col">
      {/* ===== Фон ===== */}
      <img
        src="/images/rooms-bg.webp"
        alt="Фон"
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />

      {/* ===== Градиент ===== */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40 -z-9"></div>

      <Header title="Быстрый старт" />

      <div className="flex-1 relative bg-gradient-to-br from-blue-700/10 via-purple-700/10 to-indigo-800/10 px-4 md:px-6 pt-8">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">

          {/* Заголовок */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Как начать играть за 30 секунд
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto text-[17px] font-semibold">
              Короткая инструкция для первого входа. Создай комнату и начни игру без лишних вопросов.
            </p>
          </div>
          <AnimatePresence>
            {STEPS.map((step, idx) => (
              <motion.div
                key={`rule-${idx}`}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ delay: idx * 0.25, duration: 0.2, ease: "easeInOut" }}>
                <RulesCard
                  title={step.title}
                  description={step.description}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
