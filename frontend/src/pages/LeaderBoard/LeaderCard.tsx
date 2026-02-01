import type { PlayerScore } from "./LeaderBoardPage";

type Props = {
  player: PlayerScore;
};

export const LeaderCard = ({ player }: Props) => {
  return (
    <div className="flex justify-between items-center bg-white rounded-xl shadow p-4 hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div className="text-xl font-bold text-gray-700">{player.rank}.</div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{player.name}</span>
          <span className="text-sm text-gray-500">{player.username}</span>
        </div>
      </div>
      <div className="text-lg font-bold text-blue-600">{player.points} pts</div>
    </div>
  );
};
