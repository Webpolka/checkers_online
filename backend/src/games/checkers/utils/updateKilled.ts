// server/games/checkers/updateKilled.ts
import type { Game, CheckersState } from "../types.js";

/**
 * Обновляет количество убитых шашек для каждой стороны
 * @param game - объект игры
 */
export function updateKilledPieces(game: Game): void {
  // Приводим состояние к типу шашек
  const state = game.state as CheckersState;
  if (!state) return;

  const board = state.board;

  const totalPieces = 12; // стандартное количество шашек на игрока

  // Считаем оставшиеся шашки на доске
  const whiteLeft = board.flat().filter((c) => c === "w").length;
  const blackLeft = board.flat().filter((c) => c === "b").length;

  state.killed = {
    w: totalPieces - whiteLeft, // сколько белых убито
    b: totalPieces - blackLeft, // сколько черных убито
  };
}
