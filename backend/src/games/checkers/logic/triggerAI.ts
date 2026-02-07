// server/games/checkers/triggerAI.ts
import type { Game, Move, CheckersMove, CheckersState } from "../types.js";
import { pickAIMove } from "./ai.js";

/**
 * Задержка на заданное время (для имитации "думающего" AI)
 * @param ms - миллисекунды
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Проверяет, нужно ли AI сделать ход, и выполняет его
 * @param game - игра, в которой AI может ходить
 * @param doMove - функция, которая выполняет ход
 */
export async function triggerAIMoveIfNeeded(
  game: Game,
  doMove: (move: Move<CheckersMove>) => void
): Promise<void> {
  if (!game.state || (game.state as CheckersState).completed) return;

  const state = game.state as CheckersState;

  // AI не играет против реальных игроков
  if (game.mode === "pvp") return;

  // Если игра на паузе — ничего не делаем
  if (game.status === "waiting" && game.pausedByCreator) return;

  // Определяем текущего AI игрока
  const aiPlayer = game.players.find(
    (p, idx) =>
      p.isAI &&
      ((state.currentPlayer === "w" && idx === 0) ||
        (state.currentPlayer === "b" && idx === 1))
  );

  if (!aiPlayer) return;

  // ---------------- PvE логика ----------------
  if (game.mode === "pve") {
    const movePayload = pickAIMove(state);
    if (!movePayload) return;

    // Имитируем задержку хода
    setTimeout(() => {
      doMove({ playerId: aiPlayer.id, payload: movePayload });
    }, 670); // ~0.67 секунды
    return; // рекурсия не нужна, ход один раз
  }

  // ---------------- EVE логика (два бота) ----------------
  if (game.mode === "eve") {
    // Если AI уже думает — ждем окончания
    if ((game as any).aiThinking) return;

    (game as any).aiThinking = true;

    // Задержка хода: 0.6–2 секунды, имитация "человеческого" времени
    const delayMs = 600 + Math.random() * 1400;
    await delay(delayMs);

    // Проверка актуальности игры после ожидания
    if (!game.state || (game.state as CheckersState).completed || game.status === "waiting") {
      (game as any).aiThinking = false;
      return;
    }

    const movePayload = pickAIMove(state);
    if (!movePayload) {
      (game as any).aiThinking = false;
      return;
    }

    // Выполняем ход AI
    doMove({ playerId: aiPlayer.id, payload: movePayload });

    (game as any).aiThinking = false;

    // Если игра не завершена, планируем следующий ход AI рекурсивно
    if (!(game.state as CheckersState).completed) {
      setImmediate(() => triggerAIMoveIfNeeded(game, doMove));
    }
  }
}
