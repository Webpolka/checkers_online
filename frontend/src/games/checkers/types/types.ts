// ----------------- Универсальная игра -----------------
// Клетка и доска
export type Cell = "w" | "b" | null;
export type Board = Cell[][];

export interface Position {
  row: number;
  col: number;
}

// ход шашки
export interface CheckersMove {
  from: Position;
  to: Position;
  jumped?: Position[];
}

// состояние шашек
export interface CheckersState {
  board: Board;
  currentPlayer: "w" | "b";
  selected?: Position | null; // выбранная шашка
  availableMoves?: Position[]; // массив клеток, куда можно походить
  mandatoryPieces?: Position[];
  movesCount: number;
  completed: boolean;
  winner?: "w" | "b";
  killed: {
    w: number; // сколько белых убито
    b: number; // сколько черных убито
  };
}