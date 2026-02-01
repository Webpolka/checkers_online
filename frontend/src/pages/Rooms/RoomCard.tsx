import type { Room, Player } from "@/types/rooms.types";
import { PlayerAvatar } from "./PlayerAvatar";
import { GameCard } from "./GameCard";
import { AppButton } from "@/components/ui/appButton";

type Props = {
  room: Room;
  currentPlayer: Player | null;
  onJoinRoom: () => void;
  onLeaveRoom: () => void;
  onCreateGame: () => void;
  onJoinGame: (gameId: string) => void;
  onDeleteGame: (gameId: string) => void;
};

export const RoomCard = ({
  room,
  currentPlayer,
  onJoinRoom,
  onLeaveRoom,
  onCreateGame,
  onJoinGame,
  onDeleteGame,
}: Props) => {
  const isFull = room.players.length === 2;
  const isPlayerInRoom = room.players.some(p => p.id === currentPlayer?.id);
  const isPlayerInGame = room.games.some(g =>
    g.players.some(p => p.id === currentPlayer?.id)
  );

  const [p1, p2] = room.players;

  return (
    <div className="bg-white rounded-xl p-4 shadow transition hover:shadow-lg">
      
      {/* ===== Header ===== */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
        {/* Левый блок: текст + аватарки под текстом */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-base md:text-lg">
            Комната №{room.name}
          </h3>
          <p className="text-sm text-gray-600">
            Статус:&nbsp;
            <span className={isFull ? "text-green-600" : "text-red-500"}>
              {isFull ? "активна" : "ожидание второго игрока"}
            </span>
          </p>

          <div className="flex items-center gap-2 mt-1 md:mt-2">
            <PlayerAvatar player={p1} />
            {p2 && <span className="text-gray-400 text-sm">vs</span>}
            {p2 && <PlayerAvatar player={p2} />}
          </div>
        </div>

        {/* Правый блок: кнопки */}
        <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-2 md:mt-0">
          {!isPlayerInRoom && !isPlayerInGame && (
            <AppButton
              variant={isFull ? "secondary" : "primary"}
              onClick={onJoinRoom}
              disabled={isFull}
              className="w-full md:w-auto"
            >
              Войти
            </AppButton>
          )}

          {isPlayerInRoom && (
            <AppButton
              variant="danger"
              onClick={onLeaveRoom}
              className="w-full md:w-auto"
            >
              Выйти
            </AppButton>
          )}

          {isPlayerInRoom && isFull && (
            <AppButton
              variant="accent"
              onClick={onCreateGame}
              className="w-full md:w-auto"
            >
              Создать игру
            </AppButton>
          )}
        </div>
      </div>

      {/* ===== Games ===== */}
      {isPlayerInRoom && room.games.length > 0 && (
        <div className="space-y-2">
          {room.games.map(game => (
            <GameCard
              key={game.id}
              game={game}
              currentPlayer={currentPlayer}
              onJoin={() => onJoinGame(game.id)}
              onDelete={() => onDeleteGame(game.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
