import { pieces } from "./pieces.js";
import { GameState, Instruction } from "./types.js";

export class LegalityChecker {
  check(state: GameState, move: Instruction): boolean {
    const { board } = state;

    const pCodeToMove = board[move.from[0]]![move.from[1]];
    const pieceToMove = pieces.get(pCodeToMove || null);
    // ensure piece is found
    if (!pCodeToMove || !pieceToMove) return false;

    // ensure piece is owned by player to move
    if (pieceToMove.white !== state.whiteToMove) return false;

    return true; // TODO: implement
  }
}
