import { Player } from "../games/checkers/types.js";

// User = Player + auth инфа
export type User = Player & {
  createdAt: number
}
