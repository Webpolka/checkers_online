// server/index.ts
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ServerRoom } from "./types.js";
import { generateId } from "./utils/generate.js";
import {
  Player,
  Room,
  Game,
  Move,
  CheckersState,
  CheckersMove,
  Position,
} from "./types.js";
import { CheckersService } from "./games/checkers/services.js";
import { initCheckersGame } from "./games/checkers/init.js";
import { ServerPlayer } from "./types.js";

const app = express();
const httpServer = createServer(app);
const FRONT_URL = ["https://checkers.wtemu.ru", "http://localhost:5173"];

const io = new Server(httpServer, {
  cors: { origin: FRONT_URL, methods: ["GET", "POST", "DELETE"] },
});

let rooms: ServerRoom[] = [];

// ------------------ SERVE FRONTEND ------------------
// Получаем путь к текущему файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "../../frontend/dist");
// отдаём фронт
app.use(express.static(frontendPath));

// fallback для SPA
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});
// ------------------ UTILS ------------------
const safeCallback = (callback?: (...args: any[]) => void, ...args: any[]) => {
  if (typeof callback === "function") callback(...args);
};

const removePlayerFromRoom = (playerId: string, roomId?: string) => {
  if (roomId) {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    room.players = room.players.filter((p) => p.id !== playerId);

    room.games.forEach((g) => {
      // Если игра закончена — пропускаем
      if (g.status === "finished") return;
      // Удаляем игрока из игры
      g.players = g.players.filter((p) => p.id !== playerId);
      // Если игроков стало меньше 2 — ждём второго игрока
      if (g.players.length < 2) g.status = "waiting";
    });
  } else {
    rooms.forEach(
      (r) => (r.players = r.players.filter((p) => p.id !== playerId)),
    );
  }
  // Удаляем комнаты без игроков
  rooms = rooms.filter((r) => r.players.length > 0);
};

const getVisibleRoomsForPlayer = (playerId?: string): Room[] => {
  return rooms.filter((r) => {
    if (r.players.length === 1) return true;
    if (!playerId) return false;
    return r.players.some((p) => p.id === playerId);
  });
  // return rooms;
};

const broadcastRoomsUpdate = () => {
  for (const [, socket] of io.of("/").sockets) {
    const playerId = (socket as any).playerId;
    socket.emit("rooms_updated", getVisibleRoomsForPlayer(playerId));
  }
};

// ------------------ CLEAN DISCONNECTED PLAYERS ------------------
const DISCONNECT_TIMEOUT = 30_000; // 30 секунд

setInterval(() => {
  const now = Date.now();

  rooms.forEach((room) => {
    // оставляем только тех игроков, у кого есть активное соединение
    // или последний heartbeat был менее 30 секунд назад
    room.players = room.players.filter((p) => {
      return p.connected || now - (p.lastSeen ?? 0) < DISCONNECT_TIMEOUT;
    });

    // очищаем игроков из игр
    room.games.forEach((game) => {     

      game.players = game.players.filter((p) =>
        room.players.some((rp) => rp.id === p.id),
      );

       if (game.status === "finished") return;

      // если игроков стало меньше 2 — игра снова waiting
      if (game.players.length < 2) game.status = "waiting";
    });
  });

  // удаляем комнаты без игроков
  rooms = rooms.filter((r) => r.players.length > 0);

  broadcastRoomsUpdate();
}, 5_000);

// ------------------ SOCKET.IO ------------------
io.on("connection", (socket) => {
  console.log("New websocket:", socket.id);

  // ------------------ REGISTER PLAYER ------------------
  socket.on("register_player", (player: Player) => {
    const now = Date.now();
    const serverPlayer: ServerPlayer = {
      ...player,
      socketId: socket.id,
      connected: true,
      lastSeen: now,
    };

    (socket as any).playerId = player.id;

    // если игрок уже есть в комнате — обновляем данные
    rooms.forEach((room) => {
      room.players = room.players.map((p) =>
        p.id === player.id ? serverPlayer : p,
      );
    });

    // если игрок новый — добавим его в комнаты позже при join_room
    socket.emit("rooms_updated", getVisibleRoomsForPlayer(player.id));
  });

  // ------------------ ROOMS ------------------
  socket.on("get_room", (roomId: string, callback) => {
    safeCallback(callback, rooms.find((r) => r.id === roomId) || null);
  });

  socket.on("get_rooms", (callback) => {
    const playerId = (socket as any).playerId;
    safeCallback(callback, getVisibleRoomsForPlayer(playerId));
  });

  socket.on("create_room", (player: Player, name: string, callback) => {
    const serverPlayer: ServerPlayer = {
      ...player,
      socketId: socket.id,
      connected: true,
      lastSeen: Date.now(),
    };

    const room: ServerRoom = {
      id: generateId(6),
      name,
      players: [serverPlayer],
      games: [],
      createdAt: Date.now(),
    };

    rooms.push(room);
    safeCallback(callback, room);
    broadcastRoomsUpdate();
  });

  socket.on("join_room", (player: Player, roomId: string, callback) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return safeCallback(callback, false);

    if (!room.players.some((p) => p.id === player.id)) {
      const serverPlayer: ServerPlayer = {
        ...player,
        socketId: socket.id,
        connected: true,
        lastSeen: Date.now(),
      };

      room.players.push(serverPlayer);
      socket.join(room.id);
    }

    safeCallback(callback, true);
    broadcastRoomsUpdate();
  });

  socket.on("leave_room", (player: Player, roomId: string, callback) => {
    removePlayerFromRoom(player.id, roomId);
    safeCallback(callback, true);
    broadcastRoomsUpdate();
  });

  // ------------------ GAMES ------------------
  socket.on(
    "create_game",
    (data: { roomId: string; type: string; creator: Player }) => {
      const room = rooms.find((r) => r.id === data.roomId);
      if (!room) return;

      const game: Game = {
        id: generateId(6),
        roomId: room.id,
        type: data.type,
        players: [],
        status: "waiting",
        creator: data.creator,
        history: [],
        state: data.type === "checkers" ? initCheckersGame() : undefined,
      };
      room.games.push(game);
      broadcastRoomsUpdate();
    },
  );

  socket.on("join_game", (data: { gameId: string; player: Player }) => {
    const room = rooms.find((r) => r.games.some((g) => g.id === data.gameId));
    if (!room) return;
    const game = room.games.find((g) => g.id === data.gameId);
    if (!game) return;

    const serverPlayer = room.players.find((p) => p.id === data.player.id);
    if (serverPlayer && !game.players.some((p) => p.id === serverPlayer.id)) {
      game.players.push(serverPlayer);
    }

    socket.join(room.id);
    if (game.status !== "finished") {
      game.status = game.players.length === 2 ? "started" : "waiting";
    }

    broadcastRoomsUpdate();
  });

  socket.on("leave_game", (data: { gameId: string; playerId: string }) => {
    const room = rooms.find((r) => r.games.some((g) => g.id === data.gameId));
    if (!room) return;
    const game = room.games.find((g) => g.id === data.gameId);
    if (!game) return;

    game.players = game.players.filter((p) => p.id !== data.playerId);
    game.status = "waiting";
    broadcastRoomsUpdate();
  });

  socket.on("delete_game", (data: { gameId: string; playerId: string }) => {
    for (const room of rooms) {
      const idx = room.games.findIndex((g) => g.id === data.gameId);
      if (idx === -1) continue;
      const game = room.games[idx];
      if (game.creator.id !== data.playerId) return;
      room.games.splice(idx, 1);
      broadcastRoomsUpdate();
      return;
    }
  });

  // ------------------ MAKE MOVE ------------------
  socket.on(
    "make_move",
    (data: { gameId: string; move: Move<CheckersMove> }) => {
      const { gameId, move } = data;
      const playerId = move.playerId;

      const room = rooms.find((r) => r.games.some((g) => g.id === gameId));
      if (!room) return;
      const game = room.games.find((g) => g.id === gameId);
      if (!game || !game.state) return;

      // Проверяем, что игрок участвует
      if (!game.players.some((p) => p.id === playerId)) return;

      const service = new CheckersService(game.state as CheckersState);
      const success = service.makeMove(move);
      if (!success) return;

      game.state = service.getState();
      game.history.push({
        playerId: move.playerId,
        payload: move.payload,
      });

      io.to(room.id).emit("game_updated", game);

      // Проверяем, завершилась ли игра
      const gameState = game.state as CheckersState;

      if (gameState.completed) {
        game.status = "finished";
        io.to(room.id).emit("game_finished", {
          gameId: game.id,
          winner: gameState.winner,
        });
      }
    },
  );

  // ------------------ SELECT PIECE ------------------
  socket.on(
    "select_piece",
    (data: { gameId: string; playerId: string; pos: Position }) => {
      const { gameId, playerId, pos } = data;
      const room = rooms.find((r) => r.games.some((g) => g.id === gameId));
      if (!room) return;
      const game = room.games.find((g) => g.id === gameId);
      if (!game || !game.state) return;

      const service = new CheckersService(game.state as CheckersState);
      const player = game.players.find((p) => p.id === playerId);
      if (!player) return;

      const playerColor: "w" | "b" =
        game.players[0].id === playerId ? "w" : "b";
      const updatedState = service.selectPiece(playerColor, pos);
      game.state = updatedState;

      io.to(room.id).emit("game_updated", game);
    },
  );

  // ------------------ FINISH GAME ------------------
  socket.on("finish_game", (data: { gameId: string; winnerId: string }) => {
    const { gameId, winnerId } = data;
    const room = rooms.find((r) => r.games.some((g) => g.id === gameId));
    if (!room) return;
    const game = room.games.find((g) => g.id === gameId);
    if (!game || !game.state) return;

    game.status = "finished";
    (game.state as CheckersState).completed = true;
    (game.state as CheckersState).winner =
      game.players.find((p) => p.id === winnerId)?.id === winnerId ? "w" : "b";

    io.to(room.id).emit("game_finished", { gameId, winnerId });
  });

  // ------------------ HEARTBEAT ------------------
  socket.on("heartbeat", () => {
    const playerId = (socket as any).playerId;
    if (!playerId) return;

    const now = Date.now();

    rooms.forEach((room) => {
      room.players.forEach((p) => {
        if (p.id === playerId && p.socketId === socket.id) {
          p.connected = true;
          p.lastSeen = now;
        }
      });
    });
  });

  // ------------------ DISCONNECT ------------------
  socket.on("disconnect", () => {
    const playerId = (socket as any).playerId;
    if (!playerId) return;

    const now = Date.now();

    rooms.forEach((room) => {
      room.players.forEach((p) => {
        // помечаем конкретный socket как disconnected
        if (p.id === playerId && p.socketId === socket.id) {
          p.connected = false;
          p.lastSeen = now;
        }
      });
    });

    console.log("socket disconnected", socket.id);
  });
});

// ------------------ SERVER ------------------
httpServer.listen(3000, () =>
  console.log("Server running on http://localhost:3000"),
);
