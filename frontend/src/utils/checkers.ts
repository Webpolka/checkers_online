import type { Board, Cell, Position } from "@/types/rooms.types";

// Ход шашки
export interface CheckersMove {
  from: Position;
  to: Position;
  jumped?: Position[];
}

// Проверяем, можно ли съесть шашку с позиции from -> to
function canJump(
  board: Board,
  fromRow: number,
  fromCol: number,
  player: Cell,
  dr: number,
  dc: number
): { row: number; col: number } | null {
  const midRow = fromRow + dr;
  const midCol = fromCol + dc;
  const destRow = fromRow + dr * 2;
  const destCol = fromCol + dc * 2;

  if (destRow < 0 || destRow > 7 || destCol < 0 || destCol > 7) return null;

  const midCell = board[midRow][midCol];
  const destCell = board[destRow][destCol];

  if (midCell && midCell !== player && !destCell) {
    return { row: destRow, col: destCol };
  }
  return null;
}

// Функция: возвращает все обязательные удары для игрока
export function getMandatoryJumps(board: Board, player: Cell): CheckersMove[] {
  const moves: CheckersMove[] = [];

  board.forEach((rowArr, r) => {
    rowArr.forEach((cell, c) => {
      if (cell !== player) return;

      [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => {
        const jump = canJump(board, r, c, player, dr, dc);
        if (jump) {
          moves.push({
            from: { row: r, col: c },
            to: jump,
            jumped: [{ row: r + dr, col: c + dc }],
          });
        }
      });
    });
  });

  return moves;
}
