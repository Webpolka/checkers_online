import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket, disconnectSocket } from "./socket";
import { useCheckersStore } from "@/games/checkers/stores/useCheckersStore";
import { SocketContext } from "./useSocket";

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const initPlayer = useCheckersStore((s) => s.initPlayer);
  const setOnline = useCheckersStore.setState;

  useEffect(() => {
    const s = getSocket();
    const foo =() => setSocket(s); foo();

    const player = initPlayer();

    // подключение
    s.on("connect", () => {
      console.log("SOCKET CONNECTED", s.id);
      s.emit("register_player", player); // регистрируем игрока
      s.emit("get_rooms");               // <-- получаем комнаты сразу
    });

    s.on("disconnect", () => {
      console.log("SOCKET DISCONNECTED");
    });

    s.on("online_count", (count: number) => {
      setOnline({ onlineCount: count });
    });

    const heartbeat = setInterval(() => {
      if (s.connected) s.emit("heartbeat");
    }, 500);

    return () => {
      clearInterval(heartbeat);
      s.off("connect");
      s.off("disconnect");
      s.off("online_count");
      disconnectSocket();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
