// src/constants/gameModes.ts
import type{ GameMode } from "@/types/rooms.types";

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  pvp: "PvP — Игрок vs Игрок",
  pve: "PvE — Игрок vs ИИ",
  eve: "EvE — ИИ vs ИИ (наблюдение)",
};


export const GAME_MODES: {
  value: GameMode;
  label: string;
  description: string;
}[] = [
  {
    value: "pvp",
    label: "PvP",
    description: "Игра против другого игрока",
  },
  {
    value: "pve",
    label: "PvE",
    description: "Игра против ИИ",
  },
  {
    value: "eve",
    label: "EvE",
    description: "Наблюдение за игрой ИИ",
  },
];
