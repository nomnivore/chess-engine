import { FenParser } from "./fen-parser.js";
import { ChessGame } from "./index.js";
import { GameState } from "./types.js";

// These icons are way too small on some fonts
const icons = {
  K: "\u2654",
  Q: "\u2655",
  R: "\u2656",
  B: "\u2657",
  N: "\u2658",
  P: "\u2659",

  k: "\u265A",
  q: "\u265B",
  r: "\u265C",
  b: "\u265D",
  n: "\u265E",
  p: "\u265F",

  " ": " ",
};

function color(text: string, foreground: number, background: number): string {
  const ESCAPE = "\x1b";
  const RESET = `${ESCAPE}[0m`;

  return `${ESCAPE}[48;5;${background}m${ESCAPE}[38;5;${foreground}m${text}${RESET}`;
}

export class ChessTui {
  private leftOffset = 1;

  printBoard(state: GameState) {
    console.log(`${state.whiteToMove ? "White" : "Black"} to move\n`);

    process.stdout.write(" ".repeat(this.leftOffset));
    for (let rank = 7; rank >= 0; rank--) {
      for (let file = 0; file < 8; file++) {
        const isBlackSquare = (rank + file) % 2 === 0;
        const background = isBlackSquare ? 238 : 242;

        const piece = state.board[rank]![file] || " "; // TODO: remove assertion
        const isBlackPiece = piece === piece.toLowerCase();

        const foreground = isBlackPiece ? 234 : 250;

        process.stdout.write(color(piece + " ", foreground, background));
      }
      process.stdout.write(` ${rank}\n${" ".repeat(this.leftOffset)}`);
    }
    process.stdout.write("a b c d e f g h\n");
  }
}
