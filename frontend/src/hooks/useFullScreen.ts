import { useState, useEffect, useCallback } from "react";

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // следим за состоянием
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // 👉 открыть fullscreen
  const openFullscreen = useCallback(() => {
    const elem = document.documentElement;

    if (document.fullscreenElement) return;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  }, []);

  // 👉 закрыть fullscreen
  const closeFullscreen = useCallback(() => {
    if (!document.fullscreenElement) return;

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }, []);

  return {
    isFullscreen,
    openFullscreen,
    closeFullscreen,
  };
}
