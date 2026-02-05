import { useState, useEffect, useCallback } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Слежка за изменением fullscreen
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Открыть fullscreen
  const openFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Не удалось войти в fullscreen:", err);
      });
    }
  }, []);

  // Закрыть fullscreen
  const closeFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Не удалось выйти из fullscreen:", err);
      });
    }
  }, []);

  return { isFullscreen, openFullscreen, closeFullscreen };
}
