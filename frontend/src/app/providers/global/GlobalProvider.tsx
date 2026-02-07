import React from "react";
import { motion } from "framer-motion";
import { usePreloadImages } from "@/hooks/usePreloadImages";
import { PageLoader2 } from "@/components/PageLoader2";
import OrientationGuard from "@/app/orientationGuard";

export const GlobalProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const imagesLoaded = usePreloadImages([
    "/images/rooms-bg.webp",
    "/images/splashscreen-bg.webp",
    "/images/game-bg.webp",
  ]);

  if (!imagesLoaded) return <PageLoader2 />;

  return (
    <OrientationGuard>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </OrientationGuard>
  );
};
