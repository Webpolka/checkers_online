import type { Game } from "../../types.js";
import type { Move, CheckersMove, CheckersState } from "../../types.js";
import { pickAIMove } from "./ai.js";

export function triggerAIMoveIfNeeded(
  game: Game,
  doMove: (move: Move<CheckersMove>) => void
) {
  if (!game.state || (game.state as CheckersState).completed) return;

  const state = game.state as CheckersState;

   if (game.mode == "pvp") return;
  if (game.status === "waiting" && game.pausedByCreator) return;

  // Определяем бота текущего игрока по индексу
  const aiPlayer = game.players.find((p, idx) =>
    p.isAI &&
    ((state.currentPlayer === "w" && idx === 0) || (state.currentPlayer === "b" && idx === 1))
  );

  if (!aiPlayer) return;

  setTimeout(() => {
    const payload = pickAIMove(state);
    if (!payload) return;

    doMove({ playerId: aiPlayer.id, payload });

    // Для EVE рекурсивно запускаем следующий ход
    if (game.mode === "eve" && !state.completed) {
      triggerAIMoveIfNeeded(game, doMove);
    }
  }, 600);
}
