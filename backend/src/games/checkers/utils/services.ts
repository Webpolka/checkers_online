// server/games/checkers/checkersService.ts
import type { CheckersState, CheckersMove, Move, Position } from "../types.js";
import {
  getAvailableMovesForPiece,
  getMandatoryJumps,
  getPossibleMoves,
  getJumpsFromPosition,
  getMandatoryPieces,
} from "../logic/logic.js";

/**
 * Основной класс сервиса шашек на сервере
 * Отвечает за ход, выбор шашки, серию ударов, проверку победителя
 */
export class CheckersService {
  state: CheckersState;

  constructor(initialState: CheckersState) {
    // Глубокое клонирование доски для защиты от внешних изменений
    this.state = {
      ...initialState,
      board: initialState.board.map((row) => [...row]),
    };

    // Инициализация обязательных к удару шашек
    this.updateMandatoryPieces();
  }

  /**
   * Выполнение хода игрока или AI
   * @param move - ход
   * @returns true, если ход успешно применён
   */
  makeMove(move: Move<CheckersMove>): boolean {
    const { payload } = move;
    const { board, currentPlayer, completed } = this.state;

    if (completed) return false;

    const playerColor: "w" | "b" = currentPlayer;

    // Обновляем обязательные к удару шашки
    this.state.mandatoryPieces = getMandatoryPieces(board, playerColor);

    // ---------------- Проверка валидности хода ----------------
    let validMove: CheckersMove | null = null;

    const mandatoryMoves = getMandatoryJumps(board, playerColor);

    if (mandatoryMoves.length > 0) {
      validMove =
        mandatoryMoves.find(
          (m) =>
            m.from.row === payload.from.row &&
            m.from.col === payload.from.col &&
            m.to.row === payload.to.row &&
            m.to.col === payload.to.col
        ) || null;
    } else {
      const possibleMoves = getPossibleMoves(board, playerColor);
      validMove =
        possibleMoves.find(
          (m) =>
            m.from.row === payload.from.row &&
            m.from.col === payload.from.col &&
            m.to.row === payload.to.row &&
            m.to.col === payload.to.col
        ) || null;
    }

    if (!validMove) return false;

    // ---------------- Применение хода ----------------
    const from = payload.from;
    const to = payload.to;

    board[to.row][to.col] = board[from.row][from.col];
    board[from.row][from.col] = null;

    // Удаляем съеденные шашки при ударе
    const isJump = !!validMove.jumped && validMove.jumped.length > 0;
    if (isJump) {
      validMove.jumped?.forEach((pos) => {
        board[pos.row][pos.col] = null;
      });
    }

    // ---------------- Серия ударов ----------------
    if (isJump) {
      const nextJumps = getJumpsFromPosition(board, playerColor, to);

      if (nextJumps.length > 0) {
        // Игрок остаётся — продолжение серии
        this.state.selected = to;
        this.state.availableMoves = nextJumps.map((m) => m.to);
        this.state.mandatoryPieces = [to];
        this.state.forcedPiece = to;
      } else {
        // Серия завершена — передаем ход сопернику
        this.switchPlayer();
      }
    } else {
      // Обычный ход — передаем ход сопернику
      this.switchPlayer();
    }

    this.updateMandatoryPieces();
    this.state.movesCount++;
    this.checkWinner();

    return true;
  }

  /**
   * Выбор шашки игроком — возвращает доступные клетки для хода
   */
  selectPiece(playerColor: "w" | "b", pos: Position): CheckersState {
    if (playerColor !== this.state.currentPlayer) return this.state;

    const mandatoryPieces = getMandatoryPieces(this.state.board, playerColor);

    // Если forcedPiece активен — можно выбрать только его
    if (this.state.forcedPiece) {
      if (pos.row !== this.state.forcedPiece.row || pos.col !== this.state.forcedPiece.col) {
        return this.state; // недопустимый выбор
      }
    } else if (
      mandatoryPieces.length > 0 &&
      !mandatoryPieces.some((p) => p.row === pos.row && p.col === pos.col)
    ) {
      return this.state; // нельзя выбрать другую шашку
    }

    const availableMoves = getAvailableMovesForPiece(this.state.board, playerColor, pos);

    this.state.selected = pos;
    this.state.availableMoves = availableMoves;
    this.updateMandatoryPieces();

    return { ...this.state };
  }

  /**
   * Получение текущего состояния игры (с защитой доски)
   */
  getState(): CheckersState {
    return {
      ...this.state,
      board: this.state.board.map((row) => [...row]),
    };
  }

  // ----------------------- ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ -----------------------

  /**
   * Переключает текущего игрока
   */
  private switchPlayer(): void {
    this.state.currentPlayer = this.state.currentPlayer === "w" ? "b" : "w";
    this.state.selected = null;
    this.state.availableMoves = undefined;
    this.state.mandatoryPieces = undefined;
    this.state.forcedPiece = null;
  }

  /**
   * Обновление обязательных к удару шашек
   */
  private updateMandatoryPieces(): void {
    if (this.state.forcedPiece) {
      this.state.mandatoryPieces = [this.state.forcedPiece];
    } else {
      this.state.mandatoryPieces = getMandatoryJumps(
        this.state.board,
        this.state.currentPlayer
      ).map((m) => m.from);
    }
  }

  /**
   * Проверка на победителя
   */
  private checkWinner(): void {
    const { board } = this.state;

    const wMoves = getPossibleMoves(board, "w");
    const bMoves = getPossibleMoves(board, "b");
    const wPieces = board.flat().filter((c) => c === "w").length;
    const bPieces = board.flat().filter((c) => c === "b").length;

    if (wPieces === 0 || (wMoves.length === 0 && getMandatoryJumps(board, "w").length === 0)) {
      this.state.completed = true;
      this.state.winner = "b";
    } else if (bPieces === 0 || (bMoves.length === 0 && getMandatoryJumps(board, "b").length === 0)) {
      this.state.completed = true;
      this.state.winner = "w";
    }
  }
}
