import type { Game, Player } from "@/types/rooms.types";
import { PlayerAvatar } from "./PlayerAvatar";
import { AppButton } from "@/components/ui/appButton";
import { type CheckersState } from "@/types/rooms.types";

type Props = {
  game: Game;
  currentPlayer: Player | null;
  onJoin: () => void;
  onDelete: () => void;
  roomVsAI: boolean;
};

export const GameCard = ({ game, currentPlayer, onJoin, onDelete, roomVsAI }: Props) => {
  const isPlayerInGame = game.players?.some(p => p.id === currentPlayer?.id);
  const isCreator = currentPlayer?.id === game.creator?.id;

  // ------------------ Статус ------------------
  const statusMap = {
    waiting: { label: "Ожидание", color: "bg-yellow-100 text-yellow-700" },
    started: { label: "В процессе", color: "bg-blue-100 text-blue-700" },
    finished: { label: "Завершена", color: "bg-gray-200 text-gray-700" },
  };
  const status = statusMap[game.status];

  // ------------------ Победитель ------------------
  let winnerPlayer: Player | null = null;
  let winnerLabel: string | null = null;

  if (game.status === "finished" && game.state) {
    const state = game.state as CheckersState;

    if (state.winner) {
      winnerLabel = state.winner === "w" ? "Белые" : "Чёрные";

      winnerPlayer =
        game.players.find((_, idx) =>
          (state.winner === "w" && idx === 0) ||
          (state.winner === "b" && idx === 1)
        ) ?? null;
    }
  }


  const canJoin = game.vsAI === roomVsAI;

  return (
    <div className="bg-green-100 rounded-xl shadow-md hover:shadow-lg transition flex flex-col sm:flex-row p-4 gap-4 sm:gap-6">
      {/* --------- Левая часть --------- */}
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="font-semibold text-lg sm:text-xl">
            Игра #{game.id?.slice(0, 6)}
          </div>

          {/* Победитель / игроки */}
          {game.status === "finished" ? (
            <div className="flex items-center gap-1 ml-2">
              <span className="text-yellow-500">🏆 Победили:</span>

              {winnerPlayer ? (
                <>
                  <PlayerAvatar player={winnerPlayer} size="sm" />
                  <span className="text-gray-700 text-sm">
                    {winnerPlayer.first_name}
                  </span>
                </>
              ) : (
                <span className="text-gray-700 text-sm">{winnerLabel}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {game.players.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-1">
                  <PlayerAvatar player={p} size="sm" />
                  {idx === 0 && game.players.length > 1 && (
                    <span className="text-gray-400 text-sm">vs</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Статус + Ходов */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1 sm:mt-0">
          {status && (
            <span className={`px-2 py-1 rounded-md ${status.color}`}>
              {status.label}
            </span>
          )}
          <span>{game.history?.length ?? 0} ходов</span>
        </div>
      </div>

      {/* --------- Правая часть: кнопки --------- */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 items-stretch sm:items-center">
        {game.status === "finished" ? (
          isCreator && (
            <AppButton
              variant="danger"
              onClick={onDelete}
              className="h-10 px-4 py-0 text-sm flex items-center justify-center"
            >
              Удалить
            </AppButton>
          )
        ) : (
          <>
            {!isPlayerInGame && canJoin && (
              <AppButton variant="accent" onClick={onJoin}  className="h-10 px-4 py-0 text-sm flex items-center justify-center">
                Присоединиться
              </AppButton>
            )}

            {!canJoin && (
              <div className="text-xs text-gray-400">
                Игра другого режима
              </div>
            )}

            {isPlayerInGame && (
              <AppButton
                variant="primary"
                onClick={onJoin}
                className="h-10 px-4 py-0 text-sm flex items-center justify-center"
              >
                В игру
              </AppButton>
            )}
            {isCreator && (
              <AppButton
                variant="danger"
                onClick={onDelete}
                className="h-10 px-4 py-0 text-sm flex items-center justify-center"
              >
                Удалить
              </AppButton>
            )}
          </>
        )}
      </div>
    </div>
  );
};
