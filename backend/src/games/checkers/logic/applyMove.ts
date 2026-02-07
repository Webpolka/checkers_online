// server/games/checkers/applyMove.ts
import type { Game, Move, CheckersMove, CheckersState } from "../types.js";
import type { ServerRoom } from "../types.js";
import { CheckersService } from "../utils/services.js";
import { Server } from "socket.io";
import { triggerAIMoveIfNeeded } from "./triggerAI.js";
import { updateKilledPieces } from "../utils/updateKilled.js";

/**
 * Применение хода для игрока или AI
 * Универсальная функция, обновляет состояние игры, историю и информирует клиентов через Socket.IO
 * @param io - экземпляр Socket.IO
 * @param room - комната, где проходит игра
 * @param game - объект игры
 * @param move - ход игрока или AI
 * @returns true, если ход успешно применён
 */
export function applyCheckersMove(
  io: Server,
  room: ServerRoom,
  game: Game,
  move: Move<CheckersMove>
): boolean {
  if (!game.state) return false;

  // Проверяем, что игрок участвует в игре
  if (!game.players.some((p) => p.id === move.playerId)) return false;

  // Создаём сервис шашек для работы с состоянием
  const service = new CheckersService(game.state as CheckersState);

  // Применяем ход через сервис
  const success = service.makeMove(move);
  if (!success) return false;

  // Обновляем состояние игры
  game.state = service.getState();

  // Добавляем ход в историю игры
  game.history.push({
    playerId: move.playerId,
    payload: move.payload,
  });

  // Обновляем статистику убитых шашек
  updateKilledPieces(game);

  // Отправляем обновлённое состояние игры всем игрокам комнаты
  io.to(room.id).emit("game_updated", game);

  const state = game.state as CheckersState;

  // Если игра завершена — уведомляем игроков
  if (state.completed) {
    game.status = "finished";
    io.to(room.id).emit("game_finished", {
      gameId: game.id,
      winner: state.winner,
    });
    return true;
  }

  // Триггер AI для следующего хода, если нужно
  triggerAIMoveIfNeeded(game, (aiMove) => {
    // Рекурсивно применяем ход AI через ту же функцию
    applyCheckersMove(io, room, game, {
      playerId: aiMove.playerId,
      payload: aiMove.payload,
    });
  });

  return true;
}
