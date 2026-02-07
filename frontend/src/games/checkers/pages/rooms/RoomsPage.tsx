import {
   useEffect, 
   useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCheckersStore } from "@/games/checkers/stores/useCheckersStore";
import { RoomCard } from "./RoomCard";
import { EmptyRoomsBanner } from "./EmptyRoomsBanner";
import { AppButton } from "@/components/AppButton";
import { Header } from "@/games/checkers/components/Header";
import { PageLoader } from "@/components/PageLoader";
import { CreateRoomModal } from "./CreateRoomModal";

import { motion, AnimatePresence } from "framer-motion";
import OnlineBadge from "@/components/OnlineBadge";
import { useSocketEvents } from "@/app/providers/socket/useSocketEvents";

export const RoomsPage = () => {  
  const navigate = useNavigate();
  const {
    // socket,
    rooms,
    player,   
    createRoom,
    joinRoom,
    leaveRoom,
    createGame,
    joinGame,
    deleteGame,
    onlineCount
  } = useCheckersStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useSocketEvents();

  useEffect(() => {  
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleJoinGame = (gameId: string) => {
    joinGame(gameId);
    navigate(`/checkers/rooms/game/${gameId}`);
  };

  const sortedRooms = useMemo(() => {
    return [...rooms].reverse();
  }, [rooms]);

    
  return (
    <div className="relative h-screen flex flex-col  text-white">
      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/rooms-bg.webp"
        alt="Фон шашек"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* ===== Полупрозрачный градиент сверху ===== */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40"></div>

      {/* Header */}
      <Header
        title="Игровые комнаты"
        rightContent={
          rooms.length > 0 && (
            <div className="flex items-center gap-4">
              <OnlineBadge count={onlineCount} />
              <AppButton
                variant="accent"
                onClick={() => setShowCreateRoom(true)}
                className="w-full sm:w-auto py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Создать комнату
              </AppButton>
            </div>

          )
        }
      />

      {/* Content */}
      <div className="flex-1 p-3 sm:p-6 relative">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <PageLoader />
          </div>
        ) : rooms.length === 0 ? (
          <div className="h-full">
            <EmptyRoomsBanner onCreateRoom={() => setShowCreateRoom(true)} isModalOpen={showCreateRoom} />
          </div>
        ) : (
          <div className="max-w-5xl mx-auto grid gap-4 pb-20">
            <AnimatePresence>
              {sortedRooms.map((room) => (
                <motion.div
                  key={`room-${room.id}`}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <RoomCard
                    room={room}
                    currentPlayer={player}
                    onJoinRoom={() => joinRoom(room.id)}
                    onLeaveRoom={() => leaveRoom(room.id)}
                    onCreateGame={() => createGame(room.id, room.mode)}
                    onJoinGame={handleJoinGame}
                    onDeleteGame={deleteGame}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Модалка создания комнаты */}
      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreate={(name, mode) => {
            createRoom(name, mode);
            setTimeout(() => {
              setShowCreateRoom(false);
            }, 500);
          }}
        />
      )}
    </div>
  );
};
