import { useEffect } from "react";
import { getSocket } from "@/app/providers/socket/socket";
import { useCheckersStore } from "@/games/checkers/stores/useCheckersStore";
import type { CheckersRoomsState } from "@/games/checkers/stores/useCheckersStore";
import type { Game } from "@/entities/game/types";
import type { Room } from "@/entities/room/types";

export const useSocketEvents = () => {
  const setStore = useCheckersStore.setState;

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // комнаты
    socket.on("rooms_updated", (rooms: Room[]) => {
      // console.log("ROOMS UPDATED", rooms); 
      setStore((state: CheckersRoomsState) => ({
        rooms,
        currentRoom: state.currentRoom
          ? rooms.find((r) => r.id === state.currentRoom?.id) || null
          : null,
      }));
    });

    // обновление игры
    socket.on("game_updated", (updatedGame: Game) => {
        // console.log("GAME UPDATED", updatedGame); 
      setStore((state: CheckersRoomsState) => ({
        rooms: state.rooms.map((room) => ({
          ...room,
          games: room.games.map((g) =>
            g.id === updatedGame.id ? updatedGame : g,
          ),
        })),
        currentGame:
          state.currentGame?.id === updatedGame.id
            ? updatedGame
            : state.currentGame,
      }));
    });

    return () => {
      socket.off("rooms_updated");
      socket.off("game_updated");
    };
  }, []);
};
