import { type ReactNode } from "react"
import { useEffect, useState } from "react"
import { AuthContext } from "./useAuth"
import { api } from "@/shared/api/axios"

type Props = {
  children: ReactNode
}

export const AuthProvider = ({ children }: Props) => {
  const [isAuth, setIsAuth] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      await api.get("/auth/refresh")
      setIsAuth(true)
    } catch {
      setIsAuth(false)
    } finally {
      setLoading(false)
    }
  }

  const fakeLogin = async () => {
    // имитация ответа сервера
    setIsAuth(true)
  }

  return (
    <AuthContext.Provider value={{ isAuth, loading, checkAuth, fakeLogin }}>
      {children}
    </AuthContext.Provider>
  )
}

