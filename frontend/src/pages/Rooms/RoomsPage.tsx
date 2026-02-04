import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomsStore } from "@/store/useRoomsStore";
import { RoomCard } from "./RoomCard";
import { EmptyRoomsBanner } from "./EmptyRoomsBanner";
import { AppButton } from "@/components/ui/appButton";
import { Header } from "@/components/header";
import { PageLoader } from "@/components/ui/page-loader";
import { CreateRoomModal } from "./CreateRoomModal";

export const RoomsPage = () => {
  const navigate = useNavigate();
  const {
    rooms,
    player,
    connect,
    initPlayer,
    createRoom,
    joinRoom,
    leaveRoom,
    createGame,
    joinGame,
    deleteGame,
  } = useRoomsStore();

  const [isLoaded, setIsLoaded] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);

  useEffect(() => {
    initPlayer();
    connect();
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleJoinGame = (gameId: string) => {
    joinGame(gameId);
    navigate(`/rooms/game/${gameId}`);
  };

  return (
    <div className="relative h-screen flex flex-col  text-white">
      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/rooms-bg.webp"
        alt="Фон шашек"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* ===== Полупрозрачный градиент сверху ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40"></div>

      {/* Header */}
      <Header
        title="Игровые комнаты"
        rightContent={
          rooms.length > 0 && (
            <AppButton
              variant="accent"
              onClick={() => setShowCreateRoom(true)}
              className="w-full sm:w-auto px-6 py-2 rounded-xl shadow-lg hover:scale-105 transition-transform duration-200"
            >
              Создать комнату
            </AppButton>
          )
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 relative">
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
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                currentPlayer={player}
                onJoinRoom={() => joinRoom(room.id)}
                onLeaveRoom={() => leaveRoom(room.id)}
                onCreateGame={() => createGame(room.id, room.mode)}
                onJoinGame={handleJoinGame}
                onDeleteGame={deleteGame}
              />
            ))}
          </div>
        )}
      </div>

      {/* Модалка создания комнаты */}
      {showCreateRoom && (
        <CreateRoomModal
          onClose={() => setShowCreateRoom(false)}
          onCreate={(name, mode) => {
            createRoom(name, mode);
            setShowCreateRoom(false);
          }}
        />
      )}
    </div>
  );
};
