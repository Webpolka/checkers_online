import React from "react";
import type { Room, Player } from "@/types/rooms.types";
import { PlayerAvatar } from "./PlayerAvatar";
import { GameCard } from "./GameCard";
import { AppButton } from "@/components/ui/appButton";
import { ModeSelect } from "@/components/ui/modeSelect";

type Props = {
  room: Room;
  currentPlayer: Player | null;
  onJoinRoom: () => void;
  onLeaveRoom: () => void;
  onCreateGame: (vsAI: boolean) => void;
  onJoinGame: (gameId: string) => void;
  onDeleteGame: (gameId: string) => void;
  onVsAIChange: (vsAI: boolean) => void;
};

export const RoomCard = ({
  room,
  currentPlayer,
  onJoinRoom,
  onLeaveRoom,
  onCreateGame,
  onJoinGame,
  onDeleteGame,
  onVsAIChange,
}: Props) => {
  const isPlayerInRoom = room.players.some((p) => p.id === currentPlayer?.id);
  const isPlayerInGame = room.games.some((g) =>
    g.players.some((p) => p.id === currentPlayer?.id)
  );

  const isFull = room.players.length === 2;
  const isCreator = room.creator.id === currentPlayer?.id;

  const roomMode: "ai" | "pvp" =
    room.players.some(p => typeof p.id === "string" && p.id.startsWith("ai_"))
      ? "ai"
      : "pvp";

  const roomVsAI = roomMode === "ai";


  return (
    <div className="bg-white rounded-xl p-4 shadow transition hover:shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4 gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-base md:text-lg">
            Комната №{room.id}
          </h3>
          <p className="text-sm text-gray-600">
            Статус:&nbsp;
            <span className={isFull ? "text-green-600" : "text-red-500"}>
              {isFull ? "активна" : "ожидание второго игрока"}
            </span>
          </p>

          {/* Аватары */}
          <div className="flex items-center gap-2 mt-1 md:mt-2">
            {room.players.map((p, idx) => (
              <React.Fragment key={p.id}>
                {idx > 0 && <span className="text-gray-400 text-sm">vs</span>}
                <PlayerAvatar player={p} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-2 md:mt-0">
          {!isPlayerInRoom && !isPlayerInGame && (
            <AppButton
              variant={isFull ? "secondary" : "primary"}
              onClick={onJoinRoom}
              disabled={isFull}
              className="h-10 px-4 py-0 text-sm flex items-center justify-center"
            >
              Войти
            </AppButton>
          )}

          {isPlayerInRoom && (
            <AppButton
              variant="danger"
              onClick={onLeaveRoom}
              className="h-10 px-4 py-0 text-sm flex items-center justify-center"
            >
              Выйти
            </AppButton>
          )}

          {isPlayerInRoom && (
            <div className="flex items-center gap-2 mt-2 md:mt-0">
              {/* Показываем кнопку "Создать игру" только если в комнате два игрока */}
              {isCreator && isFull && (
                <AppButton
                  variant="accent"
                  onClick={() => onCreateGame(roomVsAI)}
                  className="h-10 px-4 py-0 text-sm flex items-center justify-center"
                >
                  Создать игру
                </AppButton>
              )}
              {/* Показываем ModeSelect только создателю комнаты */}
              {room.creator.id === currentPlayer?.id && (
                <ModeSelect
                  value={roomMode}
                  onChange={(v) => onVsAIChange(v === "ai")}
                  className="h-10"
                />
              )}              
            </div>
          )}


        </div>
      </div>

      {/* Games */}
      {isPlayerInRoom && room.games.length > 0 && (
        <div className="space-y-2">
          {room.games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              currentPlayer={currentPlayer}
              roomVsAI={roomVsAI}
              onJoin={() => onJoinGame(game.id)}
              onDelete={() => onDeleteGame(game.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
