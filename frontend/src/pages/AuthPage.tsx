import { useAuth } from "@/app/providers/auth/useAuth"
import { useNavigate } from "react-router-dom"
import { api } from "@/shared/api/axios"

export const AuthPage = () => {
   const { checkAuth } = useAuth()
  const navigate = useNavigate()

   const handleEnter = async () => {
    // запрос на сервер
    await api.post("/auth/login")

    // обновляем состояние AuthProvider
    await checkAuth()

    navigate("/") // пускаем в сайт
  }


  return (
    <div style={{
      height:"100vh",
      display:"flex",
      justifyContent:"center",
      alignItems:"center",
      background:"#0f172a",
      color:"white",
      flexDirection:"column",
      gap:"20px"
    }}>
      <h1>Puzzle verification</h1>

      <button
        onClick={handleEnter}
        style={{
          padding:"16px 32px",
          fontSize:"18px",
          background:"#22c55e",
          border:"none",
          borderRadius:"12px",
          cursor:"pointer"
        }}
      >
        🧩 I solved the puzzle
      </button>
    </div>
  )
}
