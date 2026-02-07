import type { Player } from "@/entities/player/types";
import type { Game } from "@/entities/game/types";

type GameMode = "pvp" | "pve" | "eve";

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
