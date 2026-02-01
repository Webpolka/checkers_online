import { create } from "zustand";
import { persist } from "zustand/middleware";
import { io, Socket } from "socket.io-client";
import type {
  Player,
  Room,
  Game,
  Move,
  CheckersMove,
  Position,
  // CheckersState,
} from "../types/rooms.types";

const GAME_TYPE = "checkers";
const SERVER_URL = "http://localhost:3000";

interface RoomsState {
  socket: Socket | null;
  rooms: Room[];
  currentRoom: Room | null;
  currentGame: Game | null;
  player: Player | null;

  connect: () => void;
  initPlayer: () => Player;
  createRoom: (name: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  createGame: (roomId: string) => void;
  joinGame: (gameId: string) => void;
  deleteGame: (gameId: string) => void;
  leaveGame: (gameId: string) => void;

  // Расширяем для игры в шашки
  selectPiece: (gameId: string, pos: Position) => void; // сервер возвращает availableMoves
  makeMove: (gameId: string, move: Move<CheckersMove>) => void;
  updateGameState: (game: Game) => void;
  finishGame: (gameId: string, winnerId: string) => void;
}

export const useRoomsStore = create<RoomsState>()(
  persist(
    (set, get) => ({
      socket: null,
      rooms: [],
      currentRoom: null,
      currentGame: null,
      player: null,

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

      /* ---------------- connect ---------------- */
      connect: () => {
        if (get().socket) return;

        get().initPlayer();
        const socket = io(SERVER_URL);
        set({ socket });

        socket.on("connect", () => {
          const player = get().player;
          if (player) socket.emit("register_player", player);
        });

        // HEARTBEAT — ВОТ ТУТ
        setInterval(() => {
          const { socket, player } = get();
          if (socket && socket.connected && player) {
            socket.emit("heartbeat");
          }
        }, 10_000);

        // комнаты
        socket.on("rooms_updated", (rooms: Room[]) => {
          set((state) => ({
            rooms,
            currentRoom: state.currentRoom
              ? rooms.find((r) => r.id === state.currentRoom?.id) || null
              : null,
          }));
        });

        // обновление конкретной игры
        socket.on("game_updated", (updatedGame: Game) => {
          set((state) => ({
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

        // конец игры
        socket.on(
          "game_finished",
          ({ gameId, winnerId }: { gameId: string; winnerId: string }) => {
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
                  ? {
                      ...state.currentGame,
                      status: "finished",
                      winner: winnerId,
                    }
                  : state.currentGame,
            }));
          },
        );

        socket.on("disconnect", () => set({ socket: null }));
      },

      /* ---------------- rooms ---------------- */
      createRoom: (name) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("create_room", player, name);
      },

      joinRoom: (roomId) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("join_room", player, roomId);
      },

      leaveRoom: (roomId) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("leave_room", player, roomId);
      },

      /* ---------------- games ---------------- */
      createGame: (roomId: string, type: string = GAME_TYPE) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("create_game", { roomId, type, creator: player });
      },

      joinGame: (gameId: string) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("join_game", { gameId, player });
      },

      leaveGame: (gameId: string) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("leave_game", { gameId, playerId: player.id });
      },

      deleteGame: (gameId: string) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("delete_game", { gameId, playerId: player.id });
      },

      /* ---------------- checkers ---------------- */

      // выбор шашки: сервер возвращает availableMoves
      selectPiece: (gameId, pos) => {
        const { socket, player } = get();
        if (!socket || !player) return;
        socket.emit("select_piece", { gameId, playerId: player.id, pos });
      },

      makeMove: (gameId: string, move: Move<CheckersMove>) => {
        const { socket } = get();
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
