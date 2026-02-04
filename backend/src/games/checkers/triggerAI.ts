import type { Game } from "../../types.js";
import type { Move, CheckersMove, CheckersState } from "../../types.js";
import { pickAIMove } from "./ai.js";


function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function triggerAIMoveIfNeeded(
  game: Game,
  doMove: (move: Move<CheckersMove>) => void
) {
  if (!game.state || (game.state as CheckersState).completed) return;
  if (game.mode === "pvp") return;
  if (game.status === "waiting" && game.pausedByCreator) return;

  if ((game as any).aiThinking) return;
  (game as any).aiThinking = true;

  const state = game.state as CheckersState;
  const aiPlayer = game.players.find((p, idx) =>
    p.isAI &&
    ((state.currentPlayer === "w" && idx === 0) || (state.currentPlayer === "b" && idx === 1))
  );
  if (!aiPlayer) {
    (game as any).aiThinking = false;
    return;
  }

  const delayMs = game.mode === "eve" ? 600 + Math.random() * 2400 : 800;
  await delay(delayMs);

  // после "размышления" проверяем актуальность
  if (!game.state || (game.state as CheckersState).completed || game.status === "waiting") {
    (game as any).aiThinking = false;
    return;
  }

  const payload = pickAIMove(game.state as CheckersState);
  if (!payload) {
    (game as any).aiThinking = false;
    return;
  }

  doMove({ playerId: aiPlayer.id, payload });
  (game as any).aiThinking = false;

  // для EVE запускаем следующий ход отложено, чтобы не стекать рекурсию
  if (game.mode === "eve" && !(game.state as CheckersState).completed) {
    setImmediate(() => triggerAIMoveIfNeeded(game, doMove));
  }
}
