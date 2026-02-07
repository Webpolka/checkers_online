import { createUser } from "../users/user.store.js";
import { generateTokens, verifyRefresh } from "./token.service.js";

// login: создаём User на основе Player
export const loginService = () => {
  const user = createUser()  // User = Player + createdAt
  const tokens = generateTokens(user.id)
  return { user, tokens }
}

// refresh: проверяем refresh токен и выдаём новые
export const refreshService = (refreshToken: string) => {
  const data = verifyRefresh(refreshToken)
  const tokens = generateTokens(data.userId)
  return tokens
}
