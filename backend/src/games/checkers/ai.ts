// server/games/checkers/ai.ts
import type { CheckersState, CheckersMove } from "../../types.js";
import {
  getMandatoryJumps,
  getPossibleMoves,
} from "./logic.js";

/**
 * Выбирает ход для AI
 * Возвращает payload для Move<CheckersMove>
 */
export function pickAIMove(
  state: CheckersState,
): CheckersMove | null {
  const player = state.currentPlayer; // "w" | "b"
  const board = state.board;

  // 1. обязательные удары
  const mandatory = getMandatoryJumps(board, player);
  if (mandatory.length > 0) {
    return randomFrom(mandatory);
  }

  // 2. обычные ходы
  const possible = getPossibleMoves(board, player);
  if (possible.length > 0) {
    return randomFrom(possible);
  }

  // 3. ходов нет
  return null;
}

/**
 * Вспомогательная функция
 */
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
