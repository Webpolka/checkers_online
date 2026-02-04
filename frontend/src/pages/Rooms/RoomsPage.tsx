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
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header
        title="Игровые комнаты"
        rightContent={
          rooms.length > 0 && (
            <AppButton
              variant="accent"
              onClick={() => setShowCreateRoom(true)}
              className="w-full sm:w-[initial]"
            >
              Создать комнату
            </AppButton>
          )
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-3 sm:px-6 pt-6 pb-5 relative">
        {!isLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <PageLoader />
          </div>
        ) : rooms.length === 0 ? (
          <div className="h-full">
            <EmptyRoomsBanner onCreateRoom={() => setShowCreateRoom(true)} />
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

      {/* Модалка выбора режима */}
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
