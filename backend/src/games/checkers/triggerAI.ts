import type { Game } from "../../types.js";
import type { Move, CheckersMove, CheckersState } from "../../types.js";
import { pickAIMove } from "./ai.js";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function triggerAIMoveIfNeeded(
  game: Game,
  doMove: (move: Move<CheckersMove>) => void,
) {
  if (!game.state || (game.state as CheckersState).completed) return;

  const state = game.state as CheckersState;

  if (game.mode === "pvp") return;
  if (game.status === "waiting" && game.pausedByCreator) return;

  const aiPlayer = game.players.find(
    (p, idx) =>
      p.isAI &&
      ((state.currentPlayer === "w" && idx === 0) ||
        (state.currentPlayer === "b" && idx === 1)),
  );

  if (!aiPlayer) return;

  // --------------------- PvE ветка ---------------------
  if (game.mode === "pve") {
    const payload = pickAIMove(state);
    if (!payload) return;

    setTimeout(() => {
      doMove({ playerId: aiPlayer.id, payload });
    }, 670);
    return; // рекурсии нет, просто ход один раз
  }

  // --------------------- EVE ветка ---------------------
  if (game.mode === "eve") {
    if ((game as any).aiThinking) return;
    (game as any).aiThinking = true;

    const delayMs = 600 + Math.random() * 1400; // 0.6–2 сек
    await delay(delayMs);

    // проверка актуальности состояния
    if (
      !game.state ||
      (game.state as CheckersState).completed ||
      game.status === "waiting"
    ) {
      (game as any).aiThinking = false;
      return;
    }

    const payload = pickAIMove(state);
    if (!payload) {
      (game as any).aiThinking = false;
      return;
    }

    doMove({ playerId: aiPlayer.id, payload });

    (game as any).aiThinking = false;

    if (!(game.state as CheckersState).completed) {
      // рекурсивно, но через setImmediate, чтобы не стекать await
      setImmediate(() => triggerAIMoveIfNeeded(game, doMove));
    }
  }
}
