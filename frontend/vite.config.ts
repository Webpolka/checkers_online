import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true, // обязательно для WebSocket
        changeOrigin: true,
      },
    },
    host: true, // разрешаем все хосты
    strictPort: true,
    allowedHosts: ["subuncinated-shiftless-gertie.ngrok-free.dev"],
  },
});
