import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoomsStore } from "@/store/useRoomsStore";
import { RoomCard } from "./RoomCard";
import { EmptyRoomsBanner } from "./EmptyRoomsBanner";
import { AppButton } from "@/components/ui/appButton";
import { Header } from "@/components/header";
import { PageLoader } from "@/components/ui/page-loader";

export const RoomsPage = () => {
  const navigate = useNavigate();
  const {
    rooms,
    player,
    connect,
    initPlayer,
    createRoom,
    joinGame,
    joinRoom,
    leaveRoom,
    createGame,
    deleteGame,
  } = useRoomsStore();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initPlayer();
    connect();
    // через небольшую задержку ставим флаг загрузки
    const timer = setTimeout(() => setIsLoaded(true), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleCreateRoom = () => {
    createRoom(Date.now().toString());
  };

  const handleJoinGame = (gameId: string) => {
    joinGame(gameId);
    navigate(`/rooms/game/${gameId}`);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Sticky Header */}
      <Header
        title="Игровые комнаты"
        rightContent={rooms.length > 0 && (
          <AppButton variant="accent" onClick={handleCreateRoom} className="w-full sm:w-[initial]">
            Создать комнату
          </AppButton>
        )}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-3 sm:px-6 pt-6 pb-5 relative">
        {!isLoaded ? (
          // PageLoader по центру экрана
          <div className="absolute inset-0 flex items-center justify-center">
            <PageLoader />
          </div>
        ) : rooms.length === 0 ? (
          <div className="h-full">
            <EmptyRoomsBanner onCreateRoom={handleCreateRoom} />
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
                onCreateGame={() => createGame(room.id)}
                onJoinGame={handleJoinGame}
                onDeleteGame={deleteGame}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
