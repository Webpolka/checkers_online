// src/components/GameTile.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface GameTileProps {
  title: string;
  description: string;
  image: string; // путь к фоновому изображению
  route: string;
}

const GameTile: React.FC<GameTileProps> = ({ title, description, image, route }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        relative
        cursor-pointer
        rounded-2xl
        overflow-hidden
        shadow-[0_15px_30px_rgba(100,149,237,0.4)]
        transition-transform
        transform
        hover:scale-102
        duration-300             
        h-full w-full
        aspect-[10/7]
      "
      onClick={() => navigate(route)}
    >
      {/* Фоновое изображение */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/15"></div>

      {/* Контент: заголовок и описание */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-full text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-3 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.7)]">
          {title}
        </h2>
        <p className="text-lg md:text-xl opacity-95 drop-shadow-[1px_1px_3px_rgba(0,0,0,0.6)]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default GameTile;
