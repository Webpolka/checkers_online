import type { Player } from "@/entities/player/types";

type Props = {
  player?: Player;
  size?: "sm" | "md";
};

export const PlayerAvatar = ({ player, size = "md" }: Props) => {
  if (!player) return null;

  const initials = `${player?.first_name?.[0] ?? ""}${player?.last_name?.[0] ?? ""}`;
  const sizes = { sm: "w-8 h-8 text-sm", md: "w-10 h-10 text-base" };

  return (
    <div className={`rounded-full bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 flex items-center justify-center overflow-hidden ${sizes[size]} shadow-inner shadow-black/30`}>
      {player?.photo_url ? (
        <img src={player.photo_url} alt={player.first_name} className="w-full h-full object-cover rounded-full" />
      ) : (
        <span className="font-semibold text-white drop-shadow-md">{initials}</span>
      )}
    </div>
  );
};
