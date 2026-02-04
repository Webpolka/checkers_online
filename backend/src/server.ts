import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { generateId } from "./utils/generate.js";
import type {
  Player,
  Room,
  ServerRoom,
  Game,
  Move,
  GameMode,
  Position,
  CheckersMove,
  CheckersState,
} from "./types.js";
import { initCheckersGame } from "./games/checkers/init.js";
import { applyCheckersMove } from "./games/checkers/applyMove.js";
import { triggerAIMoveIfNeeded } from "./games/checkers/triggerAI.js";
import { CheckersService } from "./games/checkers/services.js";
import { removePlayerFromRoom } from "./removePlayers.js";

const app = express();
const httpServer = createServer(app);
const FRONT_URL = ["https://checkers.wtemu.ru", "http://localhost:5173"];
const io = new Server(httpServer, {
  cors: { origin: FRONT_URL, methods: ["GET", "POST", "DELETE"] },
});

let rooms: ServerRoom[] = [];

// ---------------- FRONTEND ----------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "../../frontend/dist");
app.use(express.static(frontendPath));
app.use((req, res) => res.sendFile(path.join(frontendPath, "index.html")));

// ---------------- UTILS ----------------
const safeCallback = (cb?: (...args: any[]) => void, ...args: any[]) => {
  if (cb) cb(...args);
};

// ---------------- ROOMS ----------------
// Скрытые комнаты и фильтрация по логике видимости
const getVisibleRoomsForPlayer = (playerId?: string): Room[] => {
  return rooms
    .map((room) => ({
      ...room,
      // скрытые видны только самому игроку
      players: room.players.filter((p) => !p.hidden || p.id === playerId),
    }))
    .filter((room) => {
      const humans = room.players.filter((p) => !p.isAI);
      const bots = room.players.filter((p) => p.isAI);

      // Если игрок уже в комнате — показываем всегда
      if (playerId && room.players.some((p) => p.id === playerId)) return true;

      if (humans.length === 2) return false; // 2 игрока → недоступна
      if (humans.length === 1 && bots.length === 1) return false; // 1 игрок + 1 бот → недоступна
      if (bots.length === 2) return true; // 2 бота → показываем
      if (humans.length === 1) return true; // 1 игрок → показываем
      return false;
    });
};

// Отправляем актуальные комнаты каждому подключенному
const broadcastRoomsUpdate = () => {
  for (const [, socket] of io.of("/").sockets) {
    const playerId = (socket as any).playerId;
    const visibleRooms = getVisibleRoomsForPlayer(playerId).map((room) => ({
      ...room,
      players: room.players.map((p) => ({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        username: p.username,
        photo_url: p.photo_url,
        connected: p.connected,
        lastSeen: p.lastSeen,
        isAI: p.isAI,
        hidden: p.hidden,
      })),
      // вот важное — отдаём игры с состоянием
      games: room.games.map((g) => ({
        ...g,
        players: g.players.map((p) => ({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          username: p.username,
          photo_url: p.photo_url,
          connected: p.connected,
          lastSeen: p.lastSeen,
          isAI: p.isAI,
          hidden: p.hidden,
        })),
        state: g.state, // тут передаём текущий CheckersState
      })),
    }));
    socket.emit("rooms_updated", visibleRooms);
  }
};

// Создание бота
const createBot = (id: string, name: string): Player => ({
  id,
  first_name: name,
  photo_url: "/images/ai-avatar.webp",
  socketId: "",
  connected: false,
  lastSeen: Date.now(),
  isAI: true,
});

// ---------------- SOCKET.IO ----------------
io.on("connection", (socket) => {
  console.log("New websocket:", socket.id);

  // ---------------- REGISTER PLAYER ----------------
  socket.on("register_player", (player: Player) => {
    const now = Date.now();
    const serverPlayer: Player = {
      ...player,
      socketId: socket.id,
      connected: true,
      lastSeen: now,
    };
    (socket as any).playerId = player.id;

    rooms.forEach((room) => {
      // обновляем только если не EVE
      room.players = room.players.map((p) =>
        p.id === player.id
          ? { ...serverPlayer, hidden: room.mode === "eve" ? true : p.hidden }
          : p,
      );

      // подключаем socket к комнатам
      if (room.players.some((p) => p.id === player.id)) {
        socket.join(room.id);

        room.games.forEach((game) => {
          // **EVE:** не пушим Creator в game.players
          if (game.mode === "eve") return;

          if (game.players.some((gp) => gp.id === player.id)) {
            socket.emit("game_updated", game);
          }
        });
      }
    });

    socket.emit("rooms_updated", getVisibleRoomsForPlayer(player.id));
  });

  // ---------------- ROOMS ----------------
  socket.on("get_rooms", () => {
    const playerId = (socket as any).playerId;
    const visibleRooms = getVisibleRoomsForPlayer(playerId).map((room) => ({
      ...room,
      players: room.players.map((p) => ({
        id: p.id,
        first_name: p.first_name,
        last_name: p.last_name,
        username: p.username,
        photo_url: p.photo_url,
        connected: p.connected,
        lastSeen: p.lastSeen,
        isAI: p.isAI,
        hidden: p.hidden,
      })),
      games: room.games.map((g) => ({
        ...g,
        players: g.players.map((p) => ({
          id: p.id,
          first_name: p.first_name,
          last_name: p.last_name,
          username: p.username,
          photo_url: p.photo_url,
          connected: p.connected,
          lastSeen: p.lastSeen,
          isAI: p.isAI,
          hidden: p.hidden,
        })),
        state: g.state,
      })),
    }));

    socket.emit("rooms_updated", visibleRooms);
  });

  socket.on(
    "create_room",
    (data: { creator: Player; name: string; mode: GameMode }, cb) => {
      const now = Date.now();

      // Создатель комнаты (всегда существует)
      const creatorServerPlayer: Player = {
        ...data.creator,
        socketId: socket.id,
        connected: true,
        lastSeen: now,
        hidden: data.mode === "eve", // скрываем только для EVE
      };

      let roomPlayers: Player[] = [];

      if (data.mode === "eve") {
        // EVE → два бота + скрытый создатель
        roomPlayers = [
          creatorServerPlayer,
          createBot(`ai_${generateId(4)}_1`, "AI_1"),
          createBot(`ai_${generateId(4)}_2`, "AI_2"),
        ];
      } else {
        // PvP / PvE → создатель всегда в комнате
        roomPlayers = [creatorServerPlayer];

        // PvE → сразу добавляем бота
        if (data.mode === "pve") {
          roomPlayers.push(createBot(`ai_${generateId(4)}`, "AI"));
        }
      }

      const room: ServerRoom = {
        id: generateId(6),
        name: data.name,
        players: roomPlayers,
        games: [],
        createdAt: now,
        creator: data.creator,
        mode: data.mode,
      };

      rooms.push(room);
      safeCallback(cb, room);
      broadcastRoomsUpdate();
    },
  );

  socket.on("join_room", (player: Player, roomId: string, cb) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return safeCallback(cb, false);

    if (!room.players.some((p) => p.id === player.id)) {
      const serverPlayer: Player = {
        ...player,
        socketId: socket.id,
        connected: true,
        lastSeen: Date.now(),
      };
      room.players.push(serverPlayer);
      socket.join(room.id);
    }

    safeCallback(cb, true);
    broadcastRoomsUpdate();
  });

  socket.on("leave_room", (player: Player, roomId: string, cb) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return safeCallback(cb, false);

    removePlayerFromRoom(player.id, rooms, roomId);
    safeCallback(cb, true);
    broadcastRoomsUpdate();
  });

  // ---------------- GAMES ----------------
  socket.on(
    "create_game",
    (data: {
      roomId: string;
      type: string;
      creator: Player;
      mode: GameMode;
    }) => {
      const room = rooms.find((r) => r.id === data.roomId);
      if (!room) return;

      let gamePlayers: Player[] = [];

      if (data.mode === "pvp") {
        const creatorPlayer = room.players.find(
          (p) => p.id === data.creator.id,
        );
        if (!creatorPlayer) return;
        gamePlayers = [creatorPlayer];
      } else if (data.mode === "pve") {
        // PvE — один бот
        const bot =
          room.players.find((p) => p.isAI) || createBot(`ai_${room.id}`, "AI");
        gamePlayers = [bot];
      } else if (data.mode === "eve") {
        // EVE → два бота
        const bots = room.players.filter((p) => p.isAI);
        gamePlayers = bots.slice(0, 2);
      }

      const game: Game<CheckersState, CheckersMove> = {
        id: generateId(6),
        roomId: room.id,
        type: data.type,
        players: gamePlayers,
        status: "waiting",
        creator: data.creator,
        mode: data.mode,
        history: [],
        state: initCheckersGame(),
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

    // PvE: игрок всегда первый
    if (game.mode === "pve") {
      const playerObj = room.players.find((p) => p.id === data.player.id);
      if (!playerObj) return;

      const bot = game.players.find((p) => p.isAI);
      game.players = [playerObj];
      if (bot) game.players.push(bot);

      socket.join(room.id);
    }
    // PvP: обычное добавление игрока
    else if (game.mode === "pvp") {
      const playerObj = room.players.find((p) => p.id === data.player.id);
      if (!playerObj) return;

      if (!game.players.some((p) => p.id === playerObj.id))
        game.players.push(playerObj);

      socket.join(room.id);

      if(game.players.length === 2){
         game.status = "started";
      } 
    }
    // EVE: просто стартуем игру, не добавляем игрока
    else if (game.mode === "eve") {
      game.status = "started";

      socket.join(room.id);

      triggerAIMoveIfNeeded(game, (move) => {
        applyCheckersMove(io, room, game, move);
      });
    }

    broadcastRoomsUpdate();
  });

  socket.on("leave_game", (data: { gameId: string; playerId: string }) => {
    const room = rooms.find((r) => r.games.some((g) => g.id === data.gameId));
    if (!room) return;

    const game = room.games.find((g) => g.id === data.gameId);
    if (!game) return;

    // Убираем игрока из массива
    game.players = game.players.filter((p) => p.id !== data.playerId);

    // Если PvP / PvE — обычная логика
    if (game.players.length < 2 && game.status !== "finished") {
      game.status = "waiting";
    }

    // Если EVE — всегда переводим в ожидание при выходе (чтобы можно было нажать "Начать" заново)
    if (game.mode === "eve") {
      game.status = "waiting";
      game.pausedByCreator = true;   
    }

    broadcastRoomsUpdate();
  });

  socket.on("delete_game", (data: { gameId: string; playerId: string }) => {
    const room = rooms.find((r) => r.games.some((g) => g.id === data.gameId));
    if (!room) return;
    const gameIdx = room.games.findIndex((g) => g.id === data.gameId);
    if (gameIdx === -1) return;
    if (room.games[gameIdx].creator.id !== data.playerId) return;
    room.games.splice(gameIdx, 1);
    broadcastRoomsUpdate();
  });

  // ---------------- CHECKERS ----------------
  socket.on(
    "make_move",
    (data: { gameId: string; move: Move<CheckersMove> }) => {
      const room = rooms.find((r) => r.games.some((g) => g.id === data.gameId));
      if (!room) return;
      const game = room.games.find((g) => g.id === data.gameId);
      if (!game) return;
      applyCheckersMove(io, room, game, data.move);
    },
  );

  socket.on(
    "select_piece",
    (data: { gameId: string; playerId: string; pos: Position }) => {
      const room = rooms.find((r) => r.games.some((g) => g.id === data.gameId));
      if (!room) return;
      const game = room.games.find((g) => g.id === data.gameId);
      if (!game || !game.state) return;

      const playerColor: "w" | "b" =
        game.players[0].id === data.playerId ? "w" : "b";
      const service = new CheckersService(game.state as CheckersState);
      game.state = service.selectPiece(playerColor, data.pos);
      io.to(room.id).emit("game_updated", game);
    },
  );

  socket.on("finish_game", (data: { gameId: string; winnerId: string }) => {
    const room = rooms.find((r) => r.games.some((g) => g.id === data.gameId));
    if (!room) return;
    const game = room.games.find((g) => g.id === data.gameId);
    if (!game || !game.state) return;

    game.status = "finished";
    (game.state as CheckersState).completed = true;
    (game.state as CheckersState).winner =
      game.players.find((p) => p.id === data.winnerId)?.id === data.winnerId
        ? "w"
        : "b";
    io.to(room.id).emit("game_finished", {
      gameId: game.id,
      winnerId: data.winnerId,
    });
  });

  // ---------------- HEARTBEAT ----------------
  socket.on("heartbeat", () => {
    const playerId = (socket as any).playerId;
    if (!playerId) return;
    const now = Date.now();
    rooms.forEach((room) =>
      room.players.forEach((p) => {
        if (p.id === playerId && p.socketId === socket.id) {
          p.connected = true;
          p.lastSeen = now;
        }
      }),
    );
  });

  socket.on("disconnect", () => {
    const playerId = (socket as any).playerId;
    if (!playerId) return;
    const now = Date.now();
    rooms.forEach((room) =>
      room.players.forEach((p) => {
        if (p.id === playerId && p.socketId === socket.id) {
          p.connected = false;
          p.lastSeen = now;
        }
      }),
    );
    console.log("socket disconnected", socket.id);
  });
});

// ---------------- CLEANUP DISCONNECTED PLAYERS ----------------
setInterval(() => {
  const now = Date.now();

  rooms.forEach((room) => {
    // Удаляем неактивных игроков
    const creator = room.players.find((p) => p.id === room.creator.id);

    if (
      !creator ||
      (!creator.connected && now - (creator.lastSeen ?? 0) > 60_000)
    ) {
      rooms = rooms.filter((r) => r.id !== room.id);
      return;
    }

    // чистим остальных
    room.players = room.players.filter(
      (p) =>
        p.isAI ||
        p.id === room.creator.id || // создателя НЕ ТРОГАЕМ
        now - (p.lastSeen ?? 0) < 30_000,
    );

    // Обновляем игры
    room.games.forEach((g) => {
      g.players = g.players.filter(
        (p) => p.isAI || p.connected || now - (p.lastSeen ?? 0) < 60_000,
      );

      if (g.players.length < 2 && g.status !== "finished") g.status = "waiting";
    });
  });

  broadcastRoomsUpdate();
}, 5000);

// ---------------- SERVER ----------------
httpServer.listen(3000, () =>
  console.log("Server running on http://localhost:3000"),
);
