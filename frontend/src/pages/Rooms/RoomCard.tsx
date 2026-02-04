import React from "react";
import type { Room, Player } from "@/types/rooms.types";
import { PlayerAvatar } from "./PlayerAvatar";
import { GameCard } from "./GameCard";
import { AppButton } from "@/components/ui/appButton";
import { GAME_MODE_LABELS } from "@/constants/gameModes";

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

  const isCreator = currentPlayer?.id === room.creator.id;
  const isPlayerInRoom = room.players.some(p => p.id === currentPlayer?.id);

  const canJoinRoom =
    room.mode === "pvp"
      ? room.players.length < 2
      : room.mode === "pve"
        ? room.players.length < 1
        : false; // eve — зрители, входа нет

  const humanPlayers = room.players.filter(p => !p.isAI);
  const aiPlayers = room.players.filter(p => p.isAI);

  const canCreateGame =
    isCreator && (
      (room.mode === "pvp" && humanPlayers.length === 2) || // два человека
      (room.mode === "pve" && humanPlayers.length === 1 && aiPlayers.length === 1) || // один человек + один бот
      (room.mode === "eve" && aiPlayers.length === 2) // два бота
    );

  const getRoomPlayersForCard = (room: Room): Player[] => {
    // Копируем массив, чтобы не мутировать оригинал
    let players = [...room.players];

    // Если режим EVE, убираем создателя из отображаемого списка
    if (room.mode === "eve") {
      players = players.filter(p => p.id !== room.creator.id);
    }    

    return players;
  };


  return (
    <div className="bg-white rounded-xl p-4 shadow transition hover:shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-lg">Комната {room.name ? room.name : room.id}</h3>
          <p className="text-sm text-gray-600">
            Режим: <b>{GAME_MODE_LABELS[room.mode]}</b>
          </p>

          <div className="flex items-center gap-2 mt-2">
            {getRoomPlayersForCard(room).map((p, idx) => (
              <React.Fragment key={p.id}>
                {idx > 0 && <span className="text-gray-400">vs</span>}
                <PlayerAvatar player={p} />
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row gap-2">
          {!isPlayerInRoom && canJoinRoom && (
            <AppButton variant="primary" onClick={onJoinRoom}>
              Войти
            </AppButton>
          )}

          {isPlayerInRoom && (
            <AppButton variant="danger" onClick={onLeaveRoom}>
              Выйти
            </AppButton>
          )}

          {canCreateGame && (
            <AppButton variant="accent" onClick={onCreateGame}>
              Создать игру
            </AppButton>
          )}
        </div>
      </div>

      {/* Games */}
      {room.games.length > 0 && (
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
