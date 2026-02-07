import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) return socket;

  const isDev = import.meta.env.DEV;

  socket = io(isDev ? undefined : window.location.origin, {
    path: "/socket.io/",
    transports: ["websocket", "polling"],
    withCredentials: true,
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
