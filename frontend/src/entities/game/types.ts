import type { Player } from "@/entities/player/types";
import type { CheckersState } from "@/games/checkers/types/types";

export interface Move<TPayload = unknown> {
  playerId: string;
  payload: TPayload;
}

export type GameMode = "pvp" | "pve" | "eve";

export interface Game<TMovePayload = unknown> {
  id: string;
  roomId: string;
  type: string;
  players: Player[];
  status: "waiting" | "started" | "finished";
  creator: Player;
  pausedByCreator?: boolean;
  mode: GameMode;
  history: Move<TMovePayload>[];
  state?: CheckersState;
  // state?: any;
}
