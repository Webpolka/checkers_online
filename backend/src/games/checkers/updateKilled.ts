import type{ CheckersState, Game } from "../../types.js";

export function updateKilledPieces(game: Game) {
  const gameState = game.state as CheckersState ;

  const board = gameState.board;
  const totalPieces = 12; // стандартная шашечная доска 12 на игрока
  const whiteLeft = board.flat().filter((c) => c === "w").length || 0;
  const blackLeft = board.flat().filter((c) => c === "b").length || 0;

  if (game.state) {
    gameState.killed = {
      w: totalPieces - whiteLeft,
      b: totalPieces - blackLeft,
    };
  }
}
