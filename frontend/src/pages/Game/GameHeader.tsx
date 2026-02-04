import React from "react";
import type { Player, Game } from "@/types/rooms.types";
import { AppButton } from "@/components/ui/appButton";
import { useNavigate } from "react-router-dom";

interface GameHeaderProps {
  game: Game;
  roomPlayers: Player[];
  currentPlayerId: string | null;
  currentTurnPlayerId: string | null;
  onLeaveGame: () => void;
}

export function GameHeader({
  game,
  roomPlayers,
  currentTurnPlayerId,
  onLeaveGame,
}: GameHeaderProps) {
  const navigate = useNavigate();

  // ------------------- ХОД -------------------
  const turnInfo = React.useMemo(() => {
    if (game.mode === "eve") {
      if (!game.state || typeof game.state !== "object" || !("currentPlayer" in game.state)) {
        return { text: "ИГРА НЕ ЗАГРУЖЕНА", color: "text-red-600" };
      }
      return (game.state).currentPlayer === "w"
        ? { text: "БЕЛЫЕ", color: "text-white" }
        : { text: "ЧЁРНЫЕ", color: "text-white" };
    }
    if (!currentTurnPlayerId) return { text: "ИГРОК ВЫШЕЛ", color: "text-red-600" };

    const turnPlayer = roomPlayers.find((p) => p.id === currentTurnPlayerId);
    if (!turnPlayer) return { text: "ИГРОК ВЫШЕЛ", color: "text-red-600" };

    if (game.players[0].id === turnPlayer.id) return { text: "БЕЛЫЕ", color: "text-white" };
    if (game.players[1]?.id === turnPlayer.id) return { text: "ЧЁРНЫЕ", color: "text-white" };

    return { text: "ИГРОК ВЫШЕЛ", color: "text-red-600" };
  }, [currentTurnPlayerId, roomPlayers, game.players, game.mode, game.state]);

  const filteredRoomPlayers = roomPlayers.filter(
    (p) => !(game.mode === "eve" && p.hidden)
  );

  // ------------------- DESKTOP -------------------
  const DesktopHeader = (
    <div className="hidden md:block bg-gradient-to-br from-blue-700/50 via-purple-700/50 to-indigo-800/50 shadow-2xl shadow-black/50 px-6">
      <div className="flex justify-between items-center gap-5 max-w-6xl mx-auto py-4">
        {/* Левая панель */}
        <div className="flex gap-2">
          <AppButton variant="primary" className="p-2" onClick={onLeaveGame}>
            <svg className="w-5 h-5 text-white drop-shadow-md">
              <use xlinkHref={`/sprite/sprite.svg#back`} />
            </svg>
          </AppButton>
          <AppButton variant="secondary" className="p-2" onClick={() => navigate("/rooms")}>
            <svg className="w-5 h-5 text-white drop-shadow-md">
              <use xlinkHref={`/sprite/sprite.svg#home`} />
            </svg>
          </AppButton>
        </div>

        {/* Центр */}
        <div className="flex items-center justify-between flex-1 px-6">
          <p className="text-md font-bold text-white drop-shadow-md">Игра №{game.id}</p>
          <div className={`text-lg font-extrabold drop-shadow-md ${turnInfo.color}`}>
            ХОД: {turnInfo.text}
          </div>
        </div>

        {/* Игроки */}
        <div className="flex items-center gap-4">
          {filteredRoomPlayers.map((p, idx) => {
            const isInGame = game.players.some((gp) => gp.id === p.id);
            const borderColor = isInGame ? "outline-green-400" : "outline-red-400";

            return (
              <React.Fragment key={p.id}>
                <div className="flex flex-col items-center gap-1">
                  <img
                    src={p.photo_url ?? "/images/avatar.png"}
                    className={`w-10 h-10 rounded-full object-cover outline-4 ${borderColor}`}
                  />
                  <p className="text-xs font-semibold text-white drop-shadow-md">{p.first_name}</p>
                </div>

                {idx === 0 && filteredRoomPlayers.length > 1 && (
                  <span className="text-sm font-bold text-white drop-shadow-md -mt-4">VS</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ------------------- MOBILE -------------------
  const MobileHeader = (
    <div className="md:hidden bg-gradient-to-br from-blue-700/50 via-purple-700/50 to-indigo-800/50 shadow-2xl shadow-black/50 px-3 sm:px-6 pt-6 pb-3 space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <AppButton variant="primary" className="p-2" onClick={onLeaveGame}>
            <svg className="w-5 h-5 text-white drop-shadow-md">
              <use xlinkHref={`/sprite/sprite.svg#back`} />
            </svg>
          </AppButton>
          <AppButton variant="secondary" className="p-2" onClick={() => navigate("/rooms")}>
            <svg className="w-5 h-5 text-white drop-shadow-md">
              <use xlinkHref={`/sprite/sprite.svg#home`} />
            </svg>
          </AppButton>
        </div>

        <div className="flex gap-4 items-center">
          {filteredRoomPlayers.map((p, idx) => {
            const isInGame = game.players.some((gp) => gp.id === p.id);
            const borderColor = isInGame ? "outline-green-400" : "outline-red-400";

            return (
              <React.Fragment key={p.id}>
                <div className="flex flex-col items-center gap-1">
                <img
                  src={p.photo_url ?? "/images/avatar.png"}
                  className={`w-8 h-8 rounded-full object-cover outline-4 ${borderColor}`}
                />
                <p className="text-xs font-semibold text-white drop-shadow-md ">{p.first_name}</p>
                </div>
                {idx === 0 && filteredRoomPlayers.length > 1 && (
                  <span className="text-xs font-bold text-white drop-shadow-md -mt-4">VS</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

      </div>

      <div className="text-center text-xs font-bold text-white drop-shadow-md">Игра №{game.id}</div>

      <div className="flex justify-center items-center gap-4">
        <div className={`text-lg font-extrabold drop-shadow-md ${turnInfo.color}`}>
          ХОД: {turnInfo.text}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {DesktopHeader}
      {MobileHeader}
    </>
  );
}
