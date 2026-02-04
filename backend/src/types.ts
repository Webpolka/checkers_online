export type ServerRoom = Omit<Room, "players"> & {
  players: Player[];
  mode: GameMode;
};

// Комната
export interface Room {
  id: string;
  name: string;
  players: Player[];
  createdAt: number;
  games: Game[];
  mode: GameMode;
  creator: Player;
}

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

// Ход любой игры (payload можно конкретизировать)
export interface Move<TPayload = unknown> {
  playerId: string;
  payload: TPayload; // для шашек сюда будет класть from/to/jumped
}

// Универсальная игра
export type GameMode = "pvp" | "pve" | "eve";

export interface Game<TState = unknown, TMovePayload = unknown> {
  id: string;
  roomId: string;
  type: string;
  players: Player[];
  status: "waiting" | "started" | "finished";
  creator: Player;
  pausedByCreator?:boolean;
  mode: GameMode;
  history: Move<TMovePayload>[];
  state?: TState;
}

// ----------------- Шашки -----------------
// server/types.ts

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
  forcedPiece?: Position | null;
  movesCount: number;
  completed: boolean;
  winner?: "w" | "b";
}
