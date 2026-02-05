// ----------------- Только серверные типы -----------------

// ----------------- Общие типы -----------------

// Игрок
export type Player = {
  id: string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;

  // Опциональные серверные поля
  socketId?: string;
  connected?: boolean;
  lastSeen?: number;
  isAI?: boolean;
  hidden?: boolean;
};

// ----------------- Универсальная игра -----------------

export type GameMode = "pvp" | "pve" | "eve";

// Комната
export interface Room {
  id: string;
  name: string;
  mode: GameMode;
  players: Player[];
  games: Game[];
  creator: Player;
  createdAt: number;
}

// Универсальная игра
export interface Game<TState = unknown, TMovePayload = unknown> {
  id: string;
  roomId: string;
  type: string; // название игры ("checkers", "cards", ...)
  players: Player[];
  status: "waiting" | "started" | "finished";
  creator: Player;
  pausedByCreator?: boolean;
  mode: GameMode;
  history: Move<TMovePayload>[]; // история ходов
  state?: CheckersState; // текущее состояние игры (например CheckersState)
}

// ----------------- Шашки -----------------

// Ход любой игры (payload можно конкретизировать)
export interface Move<TPayload = unknown> {
  playerId: string;
  payload: TPayload; // для шашек сюда будет класть from/to/jumped
}

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
