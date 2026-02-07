import { User } from "./user.types.js"

// временное хранилище пользователей в памяти
const users = new Map<string, User>()

export const createUser = (): User => {
  const id = "user_" + Math.random().toString(36).slice(2)

  const user: User = {
    id,
    first_name: "Player_" + id.slice(-4),
    createdAt: Date.now(),
    // по умолчанию пустые
    last_name: undefined,
    username: undefined,
    photo_url: undefined,
    socketId: undefined,
    connected: false,
    lastSeen: Date.now(),
    isAI: false,
    hidden: false
  }

  users.set(id, user)
  return user
}

export const getUser = (id: string) => users.get(id)
