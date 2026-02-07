import { useEffect, useRef, useState } from "react";
import type { Board as BoardType, Position } from "@/games/checkers/types/types";
import { drawBoard, drawPieces, drawCoordinates } from "./DrawBoard";

interface BoardProps {
  board: BoardType;
  selected: Position | null;
  availableMoves: Position[];
  mandatoryPieces?: Position[];
  onCellClick: (row: number, col: number) => void;
  playerColor: "w" | "b";
}

export function BoardCanvas({
  board,
  selected,
  availableMoves,
  mandatoryPieces = [],
  onCellClick,
  playerColor,
}: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(0);
  const size = board.length;

  const [localBoard, setLocalBoard] = useState(board);
  useEffect(() => { setLocalBoard(board) }, [board]);

  useEffect(() => {
    const resize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      setCanvasSize(Math.min(clientWidth, clientHeight));
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const drawCanvas = () => {
    if (!canvasRef.current || canvasSize === 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const margin = canvasSize * 0.05;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    drawBoard(ctx, size, canvasSize, margin, selected, availableMoves, mandatoryPieces, playerColor);
    drawPieces(ctx, localBoard, size, canvasSize, margin, playerColor);
    drawCoordinates(ctx, size, canvasSize, margin, playerColor);
  };

  useEffect(() => { drawCanvas(); }, [localBoard, selected, availableMoves, mandatoryPieces, playerColor, canvasSize]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || canvasSize === 0) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const margin = canvasSize * 0.05;
    const boardSize = canvasSize - margin * 2;
    const cellSize = boardSize / size;

    let col = Math.floor((x - margin) / cellSize);
    let row = Math.floor((y - margin) / cellSize);
    if (row < 0 || row >= size || col < 0 || col >= size) return;

    if (playerColor === "b") {
      row = size - 1 - row;
      col = size - 1 - col;
    }

    onCellClick(row, col);
  };

  return (
    <div className="flex-1 w-full pt-16 sm:pt-5 px-2">
      <div ref={containerRef} className="h-full w-full flex items-start mt-3 sm:mt-0 sm:items-center justify-center">
        <canvas
          ref={canvasRef}
          onClick={handleClick}
          className="bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-100 rounded-2xl shadow-2xl border-4 border-orange-200"
          style={{ width: canvasSize, height: canvasSize }}
        />

      </div>
    </div>
  );
}
