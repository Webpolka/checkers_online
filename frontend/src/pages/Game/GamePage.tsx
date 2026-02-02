import { useNavigate, useParams } from "react-router-dom";
// import { useEffect, useRef } from "react";
import { useSound } from "@/hooks/useSound";

import { useRoomsStore } from "@/store/useRoomsStore";
import { GameHeader } from "@/pages/Game/GameHeader";
import { BoardCanvas } from "@/pages/Game/BoardCanvas/BoardCanvas";
import type { CheckersState, Position, Game } from "@/types/rooms.types";
import Modal from "@/components/modal"; // импортируем модалку

export function GamePage() {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();
  const { rooms, player, leaveGame, selectPiece, makeMove } =
    useRoomsStore();

  // Находим игру
  const game: Game | undefined = rooms
    .flatMap((r) => r.games)
    .find((g) => g.id === gameId);

  const playMoveSound = useSound("/sounds/move.mp3");

  if (!game)
    return (
      <h1 className="text-3xl p-10 text-center text-red-500">
        Игра не найдена! <br />
        Возможно игрок удалил её.
      </h1>
    );


  const room = rooms.find((r) => r.id === game.roomId);
  if (!room)
    return (
      <h1 className="text-3xl p-10 text-center text-red-500">
        Комната не найдена! <br />
        Возможно игрок удалил её.
      </h1>
    );

  const checkersState = game.state as CheckersState | undefined;
  if (!checkersState)
    return (
      <h1 className="text-3xl p-10 text-center text-red-500">
        Состояние игры не загружено.
      </h1>
    );

  /* ------------------- обработка кликов ------------------- */
  const handleCellClick = (row: number, col: number) => {
    if (!player || !checkersState) return;

    // Проверяем, что сейчас ходит этот игрок
    const currentPlayerId =
      game.players[0].id === player.id ? "w" : "b";
    if (currentPlayerId !== checkersState.currentPlayer) return;

    const cell = checkersState.board[row][col];
    const pos: Position = { row, col };

    // Клик по своей шашке
    if (cell === checkersState.currentPlayer) {
      selectPiece(game.id, pos);
      return;
    }

    // Клик по доступной клетке
    if (checkersState.availableMoves?.some(m => m.row === row && m.col === col)) {
      if (!checkersState.selected) return; // защита

      makeMove(game.id, {
        playerId: player.id,
        payload: {
          from: checkersState.selected,
          to: pos,
        },
      });
      playMoveSound();
    }
  };


  const handleRestart = () => {
    // Можно просто перегрузить страницу или заново инициализировать игру
    navigate(`/rooms`);
  };


  const handleLeaveGame = () => {
    if (!player) return;
    leaveGame(game.id);
    navigate("/rooms");
  };

  // Определяем ID игрока, чей сейчас ход
  const currentTurnPlayerId = game.players.find((_p, i) => {
    if (checkersState.currentPlayer === "w") return i === 0;
    if (checkersState.currentPlayer === "b") return i === 1;
    return false;
  })?.id ?? null;

  // определяем цвет текущего игрока
  const playerColor = game.players.length > 0 && player
    ? game.players[0].id === player.id ? "w" : "b"
    : undefined;


  return (
    <div className="bg-gray-50 flex flex-col h-screen ">
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
        onCellClick={handleCellClick}
        playerColor={playerColor ?? "w"} // или можно вообще не рендерить, если undefined
        mandatoryPieces={checkersState.mandatoryPieces ?? []}
      />

      {/* ------------------ МОДАЛКА ПОБЕДЫ ------------------ */}
      {checkersState.completed && checkersState.winner && (
        <Modal
          state={checkersState}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

