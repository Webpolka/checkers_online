import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSound } from "@/hooks/useSound";

import { useRoomsStore } from "@/store/useRoomsStore";
import { GameHeader } from "@/pages/Game/GameHeader";
import { BoardCanvas } from "@/pages/Game/BoardCanvas/BoardCanvas";
import type { CheckersState, Position, Game } from "@/types/rooms.types";
import Modal from "@/components/modal"; // модалка победы
import { GameNotFound } from "@/components/gameNotFound";

export function GamePage() {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const { socket, connect, initPlayer, rooms, player, leaveGame, selectPiece, makeMove } =
    useRoomsStore();

  const playMoveSound = useSound("/sounds/move.mp3");

  useEffect(() => {
    initPlayer();
    if (!socket) connect();
  }, [socket]);

  const game: Game | undefined = rooms.flatMap(r => r.games).find(g => g.id === gameId);
  if (!game) return <GameNotFound message="Игра не найдена!" />;

  const room = rooms.find(r => r.id === game.roomId);
  if (!room) return <GameNotFound message="Комната не найдена!" />;

  const checkersState = game.state as CheckersState | undefined;
  if (!checkersState) return <GameNotFound message="Состояние игры не загружено." />;

  const handleCellClick = (row: number, col: number) => {
    if (!player || !checkersState) return;

    const currentPlayerId = game.players[0].id === player.id ? "w" : "b";
    if (currentPlayerId !== checkersState.currentPlayer) return;

    const cell = checkersState.board[row][col];
    const pos: Position = { row, col };

    if (cell === checkersState.currentPlayer) {
      selectPiece(game.id, pos);
      return;
    }

    if (checkersState.availableMoves?.some(m => m.row === row && m.col === col)) {
      if (!checkersState.selected) return;
      makeMove(game.id, { playerId: player.id, payload: { from: checkersState.selected, to: pos } });
      playMoveSound();
    }
  };

  const handleRestart = () => navigate("/rooms");
  const handleLeaveGame = () => { if (player) { leaveGame(game.id); navigate("/rooms"); } };

  const currentTurnPlayerId = game.players.find((_p, i) => {
    if (checkersState.currentPlayer === "w") return i === 0;
    if (checkersState.currentPlayer === "b") return i === 1;
    return false;
  })?.id ?? null;

  let playerColor: "w" | "b" = "w";
  if (game.mode !== "eve" && player && game.players.length > 0) {
    playerColor = game.players[0].id === player.id ? "w" : "b";
  }

  return (
    <div className="relative  flex flex-col h-screen">

      {/* ===== Фоновое изображение ===== */}
      <img
        src="/images/game-bg.webp"
        alt="Фон шашек"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* ===== Полупрозрачный градиент сверху ===== */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-blue-600/40 to-indigo-700/40 -z-9"></div>

      <GameHeader
        game={game}
        onLeaveGame={handleLeaveGame}
        roomPlayers={room.players}
        currentPlayerId={player?.id ?? null}
        currentTurnPlayerId={currentTurnPlayerId}
      />

      <BoardCanvas
        board={checkersState.board}
        selected={checkersState.selected ?? null}
        availableMoves={checkersState.availableMoves ?? []}
        mandatoryPieces={checkersState.mandatoryPieces ?? []}
        onCellClick={handleCellClick}
        playerColor={playerColor}
      />

      {checkersState.completed && checkersState.winner && (
        <Modal state={checkersState} onRestart={handleRestart} />
      )}
    </div>
  );
}
