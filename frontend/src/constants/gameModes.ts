// src/constants/gameModes.ts
import type { GameMode } from "@/entities/game/types";

export const GAME_MODE_LABELS: Record<GameMode, string> = {  
  pve: "PvE — Игрок vs ИИ",
  eve: "EvE — ИИ vs ИИ (наблюдение)",
  pvp: "PvP — Игрок vs Игрок",
};


export const GAME_MODES: {
  value: GameMode;
  label: string;
  description: string;
}[] = [
 
  {
    value: "pve",
    label: "PvE",
    description: "Игрок против ИИ",
  },
  {
    value: "eve",
    label: "EvE",
    description: "Наблюдение ИИ vs ИИ",
  },
   {
    value: "pvp",
    label: "PvP",
    description: "Игра с другом онлайн",
  },
];
