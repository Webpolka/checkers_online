import type {
  Board as BoardType,
  Position,
} from "@/games/checkers/types/types";
import {
  mapCell,
  isMandatory,
  isAvailable,
} from "@/games/checkers/pages/game/BoardCanvas/BoardUtils";

export const drawBoard = (
  ctx: CanvasRenderingContext2D,
  size: number,
  canvasSize: number,
  margin: number,
  selected: Position | null,
  availableMoves: Position[],
  mandatoryPieces: Position[],
  playerColor: "w" | "b",
) => {
  const cellSize = (canvasSize - 2 * margin) / size;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const { row, col } = mapCell(r, c, size, playerColor);
      const x = margin + col * cellSize;
      const y = margin + row * cellSize;

      let fillColor = (r + c) % 2 === 0 ? "#f3e3c3" : "#a56b46";

      if (selected?.row === r && selected?.col === c) {
        const grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
        grad.addColorStop(0, "#facc15");
        grad.addColorStop(1, "#f59e0b");
        fillColor = grad as unknown as string;
      } else if (isAvailable(r, c, availableMoves)) {
        const grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
        grad.addColorStop(0, "#22c55e");
        grad.addColorStop(1, "#16a34a");
        fillColor = grad as unknown as string;
      } else if (isMandatory(r, c, mandatoryPieces)) {
        const grad = ctx.createLinearGradient(x, y, x + cellSize, y + cellSize);
        grad.addColorStop(0, "#f87171");
        grad.addColorStop(1, "#ef4444");
        fillColor = grad as unknown as string;
      }

      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, cellSize, cellSize);
    }
  }
};

export const drawPieces = (
  ctx: CanvasRenderingContext2D,
  board: BoardType,
  size: number,
  canvasSize: number,
  margin: number,
  playerColor: "w" | "b",
) => {
  const cellSize = (canvasSize - 2 * margin) / size;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      const { row, col } = mapCell(r, c, size, playerColor);
      const x = margin + col * cellSize + cellSize / 2;
      const y = margin + row * cellSize + cellSize / 2;

      const radius = cellSize * 0.4;

      /* ===== ОСНОВНОЙ ДИСК ===== */
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);

      const grad = ctx.createRadialGradient(
        x - radius * 0.35,
        y - radius * 0.35,
        radius * 0.15,
        x,
        y,
        radius,
      );

      if (piece === "w") {
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, "#d8d8d8");
      } else {
        grad.addColorStop(0, "#555");
        grad.addColorStop(1, "#111");
      }

      ctx.fillStyle = grad;
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;

      /* ===== ВНЕШНЯЯ ПРОТОЧКА (БЛИЖЕ К КРАЮ) ===== */
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.78, 0, Math.PI * 2);
      ctx.strokeStyle =
        piece === "w" ? "rgba(170,170,170,0.7)" : "rgba(255,255,255,0.18)";
      ctx.lineWidth = radius * 0.1;
      ctx.stroke();

      /* ===== ВНУТРЕННЯЯ ПРОТОЧКА (ЧУТЬ ГЛУБЖЕ) ===== */
      ctx.beginPath();
      ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle =
        piece === "w" ? "rgba(190,190,190,0.6)" : "rgba(255,255,255,0.12)";
      ctx.lineWidth = radius * 0.06;
      ctx.stroke();

      /* ===== ОБВОДКА ===== */
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = piece === "w" ? "#bbb" : "#222";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
};

export const drawCoordinates = (
  ctx: CanvasRenderingContext2D,
  size: number,
  canvasSize: number,
  margin: number,
  playerColor: "w" | "b",
) => {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"].reverse();

  ctx.fillStyle = "#000";
  ctx.font = `${((canvasSize - 2 * margin) / size) * 0.3}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lettersToDraw = playerColor === "b" ? letters : [...letters].reverse();
  const numbersToDraw = playerColor === "b" ? numbers : [...numbers].reverse();

  for (let i = 0; i < size; i++) {
    const cellSize = (canvasSize - 2 * margin) / size;
    ctx.fillText(
      lettersToDraw[i],
      margin + i * cellSize + cellSize / 2,
      margin / 2,
    );
    ctx.fillText(
      lettersToDraw[i],
      margin + i * cellSize + cellSize / 2,
      canvasSize - margin / 2,
    );
    ctx.fillText(
      numbersToDraw[i],
      margin / 2,
      margin + i * cellSize + cellSize / 2,
    );
    ctx.fillText(
      numbersToDraw[i],
      canvasSize - margin / 2,
      margin + i * cellSize + cellSize / 2,
    );
  }
};
