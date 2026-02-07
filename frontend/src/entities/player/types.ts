
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
