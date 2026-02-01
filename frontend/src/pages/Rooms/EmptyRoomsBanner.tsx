import { AppButton } from "@/components/ui/appButton";

type Props = {
  onCreateRoom: () => void;
};

export const EmptyRoomsBanner = ({ onCreateRoom }: Props) => {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-dashed border-blue-200">
      {/* Изображение шашек */}
      <div className="mb-6">
        <img src="/images/draughts.webp" className="w-[30%] mx-auto" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Пока ни одной комнаты</h2>

      <p className="text-gray-600 mb-6 max-w-md">
        Стань первым, кто создаст комнату и начнёт игру. <br />
        Пригласи друга или жди соперника.
      </p>

      {/* Кнопка через AppButton */}
      <AppButton variant="primary" onClick={onCreateRoom}>
        Создать комнату
      </AppButton>
    </div>
  );
};
