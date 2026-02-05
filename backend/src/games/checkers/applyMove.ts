// server/games/checkers/applyMove.ts
import type { Game, Move, CheckersMove, CheckersState } from "../../types.js";
import type { ServerRoom } from "../../types.js";
import { CheckersService } from "./services.js";
import { Server } from "socket.io";
import { triggerAIMoveIfNeeded } from "./triggerAI.js";
import { updateKilledPieces } from "./updateKilled.js";


/**
 * Универсальное применение хода
 * Работает и для игрока, и для AI
 */
export function applyCheckersMove(
  io: Server,
  room: ServerRoom,
  game: Game,
  move: Move<CheckersMove>,
): boolean {
  if (!game.state) return false;

  // проверяем, что игрок участвует
  if (!game.players.some((p) => p.id === move.playerId)) {
    return false;
  }

  const service = new CheckersService(game.state as CheckersState);
  const success = service.makeMove(move);
  if (!success) return false;

  game.state = service.getState();

  game.history.push({
    playerId: move.playerId,
    payload: move.payload,
  });

  updateKilledPieces(game);
  // обновляем игру всем в комнате
  io.to(room.id).emit("game_updated", game);

  const state = game.state as CheckersState;

  if (state.completed) {
    game.status = "finished";
    io.to(room.id).emit("game_finished", {
      gameId: game.id,
      winner: state.winner,
    });
    return true;
  }

  triggerAIMoveIfNeeded(game, (aiMove) => {
    applyCheckersMove(io, room, game, {
      playerId: aiMove.playerId,
      payload: aiMove.payload,
    });
  });

  return true;
}
