import React, { useState } from "react";
import Confetti from "react-confetti";
import type { Room, Player } from "@/types/rooms.types";
import { PlayerAvatar } from "./PlayerAvatar";
import { GameCard } from "./GameCard";
import { AppButton } from "@/components/ui/appButton";
import { GAME_MODE_LABELS } from "@/constants/gameModes";
import { useSound } from "@/hooks/useSound";

import { motion, AnimatePresence } from "framer-motion";

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
  const isPlayerInRoom = room.players.some((p) => p.id === currentPlayer?.id);

  const [confetti, setConfetti] = useState(false);

  const playCreateSound = useSound("/sounds/create-room.mp3");

  const handleCreate = () => {
    // запускаем конфетти сразу
    setConfetti(true);
    playCreateSound();
     onCreateGame();

    // через 0.5 секунды создаём комнату и скрываем конфетти
    setTimeout(() => {
      setConfetti(false);     
    }, 1500);
  };

  const canJoinRoom =
    room.mode === "pvp"
      ? room.players.length < 2
      : room.mode === "pve"
        ? room.players.length < 1
        : false;

  const humanPlayers = room.players.filter((p) => !p.isAI);
  const aiPlayers = room.players.filter((p) => p.isAI);

  const canCreateGame =
    isCreator &&
    ((room.mode === "pvp" && humanPlayers.length === 2) ||
      (room.mode === "pve" && humanPlayers.length === 1 && aiPlayers.length === 1) ||
      (room.mode === "eve" && aiPlayers.length === 2));

  const getRoomPlayersForCard = (room: Room): Player[] => {
    let players = [...room.players];
    if (room.mode === "eve") players = players.filter((p) => p.id !== room.creator.id);
    return players;
  };
 

  return (
    <> {confetti && (
      <Confetti
        numberOfPieces={100}
        recycle={false}
        gravity={0.3}
        tweenDuration={500}
        initialVelocityX={{ min: -20, max: 20 }}
        initialVelocityY={{ min: -20, max: 20 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
    )}
      <div className="bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-800 rounded-2xl p-4 shadow-2xl shadow-black/50 transition hover:scale-[1.01] duration-300">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-xl drop-shadow-md">Комната {room.name || room.id}</h3>
            <p className="text-white/80 text-sm mt-1">
              Режим: <b>{GAME_MODE_LABELS[room.mode]}</b>
            </p>

            <div className="flex items-center gap-2 mt-2">
              {getRoomPlayersForCard(room).map((p, idx) => (
                <React.Fragment key={p.id}>
                  {idx > 0 && <span className="text-white/60">vs</span>}
                  <PlayerAvatar player={p} />
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-2">
            {!isPlayerInRoom && canJoinRoom && (
              <AppButton variant="accent" onClick={onJoinRoom}>
                Войти
              </AppButton>
            )}
            {isPlayerInRoom && (
              <AppButton variant="danger" onClick={onLeaveRoom}>
                Выйти
              </AppButton>
            )}
            {canCreateGame && (
              <AppButton variant="accent" onClick={handleCreate}>
                Создать игру
              </AppButton>
            )}
          </div>
        </div>

        {/* Games */}
        {room.games.length > 0 && (          
          <div className="space-y-4">
            <AnimatePresence>
            {[...room.games].reverse().map((game) => (
              <motion.div
                  key={`gamecard-${game.id}`}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
              <GameCard               
                game={game}
                currentPlayer={currentPlayer}
                onJoin={() => onJoinGame(game.id)}
                onDelete={() => onDeleteGame(game.id)}
              />
              </motion.div>
            ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};
