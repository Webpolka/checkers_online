import type { Game } from "../../types.js";
import type { Move, CheckersMove, CheckersState } from "../../types.js";
import { pickAIMove } from "./ai.js";

export function triggerAIMoveIfNeeded(
  game: Game,
  doMove: (move: Move<CheckersMove>) => void,
) {
  const state = game.state as CheckersState;

  if (!game.vsAI) return;
  if (!game.state || state.completed) return;

  const ai = game.players.find((p) => p.id.startsWith("ai_"));
  if (!ai) return;

  const aiColor = game.players[0].id === ai.id ? "w" : "b";

  if (state.currentPlayer !== aiColor) return;

  setTimeout(() => {
    const payload = pickAIMove(state);
    if (!payload) return;

    doMove({
      playerId: ai.id,
      payload,
    });
  }, 600);
}
