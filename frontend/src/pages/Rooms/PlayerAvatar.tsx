import type { Player } from "@/types/rooms.types";

type Props = {
  player?: Player;
  size?: "sm" | "md";
};

export const PlayerAvatar = ({ player, size = "md" }: Props) => {
  if (!player) return null;

  const initials = `${player?.first_name?.[0] ?? ""}${player?.last_name?.[0] ?? ""}`;

  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
  };

  return (
    <div className={`rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${sizes[size]}`}>
      {player?.photo_url ? (
        <img src={player.photo_url} alt={player.first_name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-gray-600">{initials}</span>
      )}
    </div>
  );
};
