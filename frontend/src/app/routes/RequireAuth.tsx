import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/app/providers/auth/useAuth";
import { PageLoader2 } from "@/components/PageLoader2";

export const RequireAuth = () => {
  const { isAuth, loading } = useAuth()

  if (loading) return <PageLoader2></PageLoader2>

  if (!isAuth) return <Navigate to="/auth" replace />

  return <Outlet />
}
