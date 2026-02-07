// src/app/App.tsx
import { GlobalProviders } from "@/app/providers/global/GlobalProvider";
import { SocketProvider } from "@/app/providers/socket/SocketProvider";
import { useSocketEvents } from "@/app/providers/socket/useSocketEvents";
import { AuthProvider } from "./providers/auth/AuthProvider"
import { AppRouter } from "./routes/AppRouter"

export const App = () => {
  useSocketEvents();
  return (
    <GlobalProviders>
      <SocketProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </SocketProvider>
    </GlobalProviders>
  )
};


