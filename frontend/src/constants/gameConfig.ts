// src/config/games.ts
export interface GameConfig {
  id: string;
  title: string;
  description: string;
  image: string;
  route: string;
}

export const games: GameConfig[] = [
  {
    id: "checkers",
    title: "Шашки",
    description: "Классическая игра в шашки. Проверь свои стратегические навыки!",
    image: "/images/checkers-bg.webp",
    route: "/checkers",
  },
  {
    id: "chess",
    title: "Шахматы",
    description: "Сыграй в шахматы против других игроков или ИИ.",
    image: "/images/chess-bg.webp",
    route: "/chess",
  },
];
