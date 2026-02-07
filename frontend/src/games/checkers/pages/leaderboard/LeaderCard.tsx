import type { PlayerScore } from "./LeaderBoardPage";

type Props = {
  player: PlayerScore;
};

const rankStyles: Record<number, string> = {
  1: "bg-yellow-300 text-black",
  2: "bg-orange-300 text-black",
  3: "bg-violet-400 text-black",
};

export const LeaderCard = ({ player }: Props) => {
  const isTop = player.rank <= 3;

  return (
    <div
      className={`
        flex items-center justify-between
        rounded-2xl px-5 py-4
        backdrop-blur-md
        bg-white/20
        border border-white/15
        shadow-lg shadow-black/20
        transition-all
        hover:bg-white/15
      `}
    >
      <div className="flex items-center gap-4">
        {/* Ранг */}
        <div
          className={`
            w-10 h-10 flex items-center justify-center
            rounded-full font-extrabold
            ${isTop ? rankStyles[player.rank] : "bg-white/40 text-white"}
          `}
        >
          {player.rank}
        </div>

        {/* Имя */}
        <div className="flex flex-col">
          <span className="font-bold text-white leading-tight">
            {player.name}
          </span>
          <span className="text-sm text-white/60">
            {player.username}
          </span>
        </div>
      </div>

      {/* Очки */}
      <div className="text-lg font-extrabold text-green-100">
        {player.points} pts
      </div>
    </div>
  );
};
