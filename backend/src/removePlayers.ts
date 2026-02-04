import { type Room } from "./types.js";

export const removePlayerFromRoom = (
  playerId: string,  
  rooms: Room[],
  roomId?: string,
) => {
  if (roomId) {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    // Убираем игрока из комнаты
    room.players = room.players.filter((p) => p.id !== playerId);

    // Убираем игрока из всех игр комнаты
    room.games.forEach((g) => {
      g.players = g.players.filter((p) => p.id !== playerId);
      if (g.players.length < 2 && g.status !== "finished") g.status = "waiting";
    });

    // Если создатель покинул комнату — удаляем комнату целиком
    if (!room.players.some((p) => p.id === room.creator.id)) {
      rooms = rooms.filter((r) => r.id !== room.id);
      return;
    }
  } else {
    // Если roomId не указан — проверяем все комнаты
    rooms.forEach((room) => {
      room.players = room.players.filter((p) => p.id !== playerId);
      room.games.forEach((g) => {
        g.players = g.players.filter((p) => p.id !== playerId);
        if (g.players.length < 2 && g.status !== "finished")
          g.status = "waiting";
      });
    });

    // Удаляем пустые комнаты
    rooms = rooms.filter((r) => r.players.length > 0);    
  }
};
