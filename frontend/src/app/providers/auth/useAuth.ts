import { createContext, useContext } from "react";

export type AuthContextType = {
  isAuth: boolean;
  loading: boolean;
  checkAuth: () => Promise<void>;
  fakeLogin: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
