import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  ACCESS_EXPIRES,
  REFRESH_EXPIRES,
} from "../config.js";

// payload тип токена
interface TokenPayload extends JwtPayload {
  userId: string;
}

// expiresIn тип (jsonwebtoken ожидает StringValue | number)
const accessOptions: SignOptions = {
  expiresIn: ACCESS_EXPIRES as SignOptions["expiresIn"],
};

const refreshOptions: SignOptions = {
  expiresIn: REFRESH_EXPIRES as SignOptions["expiresIn"],
};

// ---------- GENERATE ----------
export const generateTokens = (userId: string) => {
  if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets not defined in ENV");
  }

  const payload: TokenPayload = { userId };

  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, accessOptions);
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, refreshOptions);

  return { accessToken, refreshToken };
};

// ---------- VERIFY ----------
export const verifyRefresh = (token: string): TokenPayload => {
  if (!JWT_REFRESH_SECRET) {
    throw new Error("JWT refresh secret not defined");
  }

  const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

  return decoded as TokenPayload;
};
