import type { FC } from "react";

type Props = {
  killed: number[];       // [blackCount, whiteCount]
  size?: number;          // размер кружка
  className?: string;
};

export const KilledPiecesRow: FC<Props> = ({ killed, size = 18, className }) => {
  const [black, white] = killed;

  const pieceStyle = (color: "b" | "w") => ({
    width: size,
    height: size,
    borderRadius: "50%",
    border: "1px solid black/80",
    background: color === "b" 
      ? "radial-gradient(circle at 30% 30%, #555, #000)" 
      : "radial-gradient(circle at 30% 30%, #fff, #ccc)",
    boxShadow: color === "b" 
      ? "inset -1px -1px 2px rgba(255,255,255,0.3), inset 1px 1px 2px rgba(0,0,0,0.5)"
      : "inset -1px -1px 2px rgba(0,0,0,0.1), inset 1px 1px 2px rgba(255,255,255,0.7)",
  });

  return (
    <div className={`flex justify-between items-center gap-4 ${className}`}>
      {/* Черные шашки */}
      <div className="flex items-center gap-2">
        <div style={pieceStyle("w")} />
        <span className="text-[15px] text-white">{white}</span>
      </div>

      {/* Белые шашки */}
      <div className="flex items-center gap-1">
        <div style={pieceStyle("b")} />
        <span className="text-[15px] text-white">{black}</span>
      </div>
    </div>
  );
};
