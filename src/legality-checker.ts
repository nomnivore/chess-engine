import { pieces } from "./pieces.js";
import { GameState, Instruction } from "./types.js";

export class LegalityChecker {
  checkMove(state: GameState, move: Instruction): boolean {
    const { board } = state;

    const pCodeToMove = board[move.from[0]]![move.from[1]];
    const pieceToMove = pieces.get(pCodeToMove || null);
    // ensure piece is found
    if (!pCodeToMove || !pieceToMove) return false;

    // ensure piece is owned by player to move
    if (pieceToMove.white !== state.whiteToMove) return false;

    // ensure piece can move to the destination
    const moves = pieceToMove.possibleMoves(state, move.from);
    if (!moves.some((m) => m[0] === move.to[0] && m[1] === move.to[1]))
      return false;

    // TODO: ensure move does not put player in check

    return true;
  }

  isCheck(state: GameState, white: boolean): boolean {
    const { board } = state;

    for (let rIdx = 0; rIdx < 8; rIdx++) {
      for (let fIdx = 0; fIdx < 8; fIdx++) {
        const pieceCode = board[rIdx]![fIdx];

        const piece = pieces.get(pieceCode || null);
        if (!piece || piece.white === white) continue;

        if (piece.canCaptureKing(state, [rIdx, fIdx])) return true;
      }
    }

    return false;
  }

  isCheckmate(state: GameState, white: boolean): boolean {
    const { board } = state;

    if (!this.isCheck(state, white)) return false;

    // check every piece's moves to see if it will help us escape check

    for (let rIdx = 0; rIdx < 8; rIdx++) {
      for (let fIdx = 0; fIdx < 8; fIdx++) {
        const pieceCode = board[rIdx]![fIdx];

        const piece = pieces.get(pieceCode || null);
        if (!piece || piece.white === white) continue;

        const moves = piece.possibleMoves(state, [rIdx, fIdx]);

        for (const move of moves) {
          // need to clone the game state to make changes without affecting the original
          // TODO: implement
          break;
        }
      }
    }

    return false;
  }
}
