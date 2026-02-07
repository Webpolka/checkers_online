// server/rooms/removePlayer.ts
import type { Room } from "../types.js";

/**
 * Удаляет игрока из комнаты или всех комнат
 * @param playerId - ID игрока
 * @param rooms - массив всех комнат
 * @param roomId - необязательный ID конкретной комнаты
 */
export const removePlayerFromRoom = (
  playerId: string,
  rooms: Room[],
  roomId?: string,
): void => {
  if (roomId) {
    // Удаление из конкретной комнаты
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;

    // Убираем игрока из комнаты
    room.players = room.players.filter((p) => p.id !== playerId);

    // Убираем игрока из всех игр комнаты
    room.games.forEach((g) => {
      g.players = g.players.filter((p) => p.id !== playerId);

      // Если после удаления меньше 2 игроков, игра в ожидании
      if (g.players.length < 2 && g.status !== "finished") g.status = "waiting";
    });

    // Если создатель покинул комнату — удаляем комнату
    const creatorStillPresent = room.players.some((p) => p.id === room.creator.id);
    if (!creatorStillPresent) {
      const idx = rooms.findIndex((r) => r.id === room.id);
      if (idx >= 0) rooms.splice(idx, 1);
    }

  } else {
    // Если roomId не указан — проверяем все комнаты
    rooms.forEach((room) => {
      // Удаляем игрока из комнаты
      room.players = room.players.filter((p) => p.id !== playerId);

      // Удаляем игрока из игр
      room.games.forEach((g) => {
        g.players = g.players.filter((p) => p.id !== playerId);

        if (g.players.length < 2 && g.status !== "finished") g.status = "waiting";
      });
    });

    // Удаляем полностью пустые комнаты
    for (let i = rooms.length - 1; i >= 0; i--) {
      if (rooms[i].players.length === 0) rooms.splice(i, 1);
    }
  }
};
