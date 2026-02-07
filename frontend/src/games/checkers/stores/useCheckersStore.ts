import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type GameMode } from "@/entities/game/types";
import type { Player } from "@/entities/player/types";
import type { Room } from "@/entities/room/types";
import type { Game, Move } from "@/entities/game/types";
import type { Position, CheckersMove } from "@/games/checkers/types/types";
import { getSocket } from "@/app/providers/socket/socket";

const GAME_TYPE = "checkers";

export interface CheckersRoomsState {
  // socket: Socket | null;
  rooms: Room[];
  currentRoom: Room | null;
  currentGame: Game | null;
  player: Player | null;
  onlineCount: number;

  // connect: () => void;
  initPlayer: () => Player;
  createRoom: (name: string, mode: GameMode) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;

  createGame: (roomId: string, mode: GameMode) => void;
  joinGame: (gameId: string) => void;
  deleteGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;

  // Расширяем для игры в шашки
  selectPiece: (gameId: string, pos: Position) => void; // сервер возвращает availableMoves
  makeMove: (gameId: string, move: Move<CheckersMove>) => void;
  updateGameState: (game: Game) => void;
  finishGame: (gameId: string, winnerId: string) => void;
}

export const useCheckersStore = create<CheckersRoomsState>()(
  persist(
    (set, get) => ({
      // socket: null,
      rooms: [],
      currentRoom: null,
      currentGame: null,
      player: null,
      onlineCount: 0,

      /* ---------- player ---------- */
      initPlayer: () => {
        const existing = get().player;
        if (existing) return existing;
        const player: Player = {
          id: crypto.randomUUID(),
          first_name: "Player",
          photo_url: "/images/avatar.png",
        };
        set({ player });
        return player;
      },

      createRoom: (name: string, mode: GameMode) => {
        const { player } = get();
        const socket = getSocket();
        if (!socket || !player) return;

        console.log("EMIT CREATE ROOM", name, mode); // 🔥 проверка
        socket.emit("create_room", { creator: player, name, mode });
      },

      joinRoom: (roomId) => {
        const { player } = get();
        const socket = getSocket();
        if (!socket || !player) return;
        socket.emit("join_room", player, roomId);
      },

      leaveRoom: (roomId) => {
        const { player } = get();
        const socket = getSocket();
        if (!socket || !player) return;
        socket.emit("leave_room", player, roomId);
      },

      /* ---------------- games ---------------- */
      createGame: (roomId: string, type: string = GAME_TYPE) => {
        const { player, rooms } = get();
        const socket = getSocket();
        if (!socket || !player) return;

        const room = rooms.find((r) => r.id === roomId);
        if (!room) return;

        socket.emit("create_game", {
          roomId,
          type,
          creator: player,
          mode: room.mode, // <-- наследуем режим комнаты
        });
      },

      joinGame: (gameId: string) => {
        const { player } = get();
        const socket = getSocket();
        if (!socket || !player) return;
        socket.emit("join_game", { gameId, player });
      },

      leaveGame: (gameId: string) => {
        const { player } = get();
        const socket = getSocket();
        if (!socket || !player) return;
        socket.emit("leave_game", { gameId, playerId: player.id });
      },

      deleteGame: (gameId: string) => {
        const { player } = get();
        const socket = getSocket();
        if (!socket || !player) return;
        socket.emit("delete_game", { gameId, playerId: player.id });
      },

      /* ---------------- checkers ---------------- */

      // выбор шашки: сервер возвращает availableMoves
      selectPiece: (gameId, pos) => {
        const { player } = get();
        const socket = getSocket();
        if (!socket || !player) return;
        socket.emit("select_piece", { gameId, playerId: player.id, pos });
      },

      makeMove: (gameId: string, move: Move<CheckersMove>) => {
        const socket = getSocket();
        if (!socket) return;
        socket.emit("make_move", { gameId, move });
      },

      updateGameState: (game: Game) => {
        set((state) => ({
          rooms: state.rooms.map((room) => ({
            ...room,
            games: room.games.map((g) => (g.id === game.id ? game : g)),
          })),
          currentGame:
            state.currentGame?.id === game.id ? game : state.currentGame,
        }));
      },

      finishGame: (gameId: string, winnerId: string) => {
        set((state) => ({
          rooms: state.rooms.map((room) => ({
            ...room,
            games: room.games.map((g) =>
              g.id === gameId
                ? { ...g, status: "finished", winner: winnerId }
                : g,
            ),
          })),
          currentGame:
            state.currentGame?.id === gameId
              ? { ...state.currentGame, status: "finished", winner: winnerId }
              : state.currentGame,
        }));
      },
    }),
    {
      name: "rooms-storage",
      partialize: (state) => ({
        player: state.player,
        rooms: state.rooms,
        currentRoom: state.currentRoom,
      }),
    },
  ),
);
