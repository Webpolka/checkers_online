import { AppButton } from "@/components/ui/appButton";

type Props = {
  onCreateRoom: () => void;
  isModalOpen: boolean;
};

export const EmptyRoomsBanner = ({ onCreateRoom, isModalOpen }: Props) => {
  return (
    <div
      className={`
        max-w-5xl mx-auto h-full
        flex items-center justify-center
        px-6 py-8
        bg-gradient-to-br from-blue-700/75 via-purple-700/75 to-indigo-800/75
        rounded-2xl shadow-2xl shadow-black/50
        text-center
        transition-all duration-300
        ${isModalOpen ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
      `}
    >
      {/* ВНУТРЕННИЙ КОНТЕНТ */}
      <div className="flex flex-col items-center max-w-5xl w-full">
        <img
          src="/images/draughts.webp"
          className="w-[60%] rounded-lg mb-6"
        />

        <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md mb-2">
          Пока ни одной комнаты
        </h2>

        <p className="text-white/80 mb-6 max-w-sm">
          Стань первым, кто создаст комнату и начнёт игру. <br />
          Пригласи друга или жди соперника.
        </p>

        {/* Ограничиваем кнопку */}
        <div className="w-auto">
          <AppButton variant="accent" onClick={onCreateRoom}>
            Создать комнату
          </AppButton>
        </div>
      </div>
    </div>
  );
};
