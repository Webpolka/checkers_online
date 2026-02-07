import { PlayerAvatar } from "./PlayerAvatar";
import { AppButton } from "@/components/AppButton";

// Import types
import type { CheckersState } from "@/games/checkers/types/types";
import type { Player } from "@/entities/player/types";
import type { Game } from "@/entities/game/types";

type Props = {
  game: Game;
  isPlayerInRoom: boolean; 
  currentPlayer: Player | null;
  onJoin: () => void;
  onDelete: () => void;
};

export const GameCard = ({ game,isPlayerInRoom, currentPlayer, onJoin, onDelete }: Props) => {
  const isPlayerInGame = game.players.some((p) => p.id === currentPlayer?.id);
  const isCreator = currentPlayer?.id === game.creator?.id;

  const statusMap = {
    waiting: { label: "Ожидание", color: "bg-gradient-to-r from-orange-400 via-red-400 to-pink-500 text-white/90" },
    started: { label: "В процессе", color: "bg-blue-400/40 text-blue-200" },
    finished: { label: "Завершена", color: "bg-gray-400/30 text-gray-200" },
  };
  const status = statusMap[game.status];

  let winnerLabel: string | null = null;
  let winnerPlayer: Player | null = null;

  if (game.status === "finished" && game.state) {
    const state = game.state as CheckersState;
    if (state.winner) {
      winnerLabel = state.winner === "w" ? "Белые" : "Чёрные";
      winnerPlayer =
        game.players.find((_, idx) =>
          (state.winner === "w" && idx === 0) || (state.winner === "b" && idx === 1)
        ) ?? null;
    }
  }

  const showJoinButton = !isPlayerInGame && (game.mode === "pvp" || game.mode === "pve");
  const showPlayButton = isPlayerInGame && (game.mode === "pvp" || game.mode === "pve");
  const showStartButton = !isPlayerInGame && game.mode === "eve";
  const gameText = game.mode === "eve" && game.status === "waiting" && game.pausedByCreator ? "Продолжить" : "Начать";

  return (
    <div className="bg-gradient-to-br from-purple-950 via-indigo-800 to-blue-950 rounded-2xl shadow-lg shadow-black/60 p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 transition hover:scale-[1.01] duration-200">
      {/* Левая часть */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="font-semibold text-lg sm:text-xl text-white drop-shadow-md">
            Игра №{game.id?.slice(0, 6)}
          </div>

          {game.status === "finished" ? (
            <div className="flex items-center gap-1 ml-2 text-white/90">
              <span className="text-yellow-300 drop-shadow-md">🏆 Победа:</span>
              {winnerPlayer ? (
                <>
                  <PlayerAvatar player={winnerPlayer} size="sm" />
                  <span className="text-white/80 text-sm">{winnerPlayer.first_name}</span>
                </>
              ) : (
                <span className="text-white/80 text-sm font-bold">{winnerLabel}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {game.players.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-1">
                  <PlayerAvatar player={p} size="sm" />
                  {idx === 0 && game.players.length > 1 && <span className="text-white/60 text-sm">vs</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-white/80 mt-1 sm:mt-0">
          {status && <span className={`px-2 py-1 rounded-md ${status.color}`}>{status.label}</span>}
          <span>{game.history?.length ?? 0} ходов</span>
        </div>
      </div>

      {/* Правая часть */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center">
        {game.status !== "finished" && (
          <>
            {showJoinButton && isPlayerInRoom &&<AppButton variant="accent" onClick={onJoin}>Присоединиться</AppButton>}
            {showPlayButton && <AppButton variant="secondary" onClick={onJoin}>В игру</AppButton>}
            {showStartButton && isCreator && <AppButton variant="accent" onClick={onJoin}>{gameText}</AppButton>}
          </>
        )}
        {isCreator && <AppButton variant="danger" onClick={onDelete}>Удалить</AppButton>}
      </div>
    </div>
  );
};
