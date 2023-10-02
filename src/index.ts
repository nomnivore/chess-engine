import { FenParser } from "./fen-parser.js";
import { MoveParser } from "./move-parser.js";
import { GameState, Optional } from "./types.js";

export const DEFAULT_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export type ChessGameOptions = Optional<{
  fenParser: FenParser;
  moveParser: MoveParser;
  fen: string;
}>;

export class ChessGame {
  public fenParser: FenParser;
  public moveParser: MoveParser;
  public state: GameState;

  constructor({ fenParser, fen, moveParser }: ChessGameOptions = {}) {
    this.fenParser = fenParser || new FenParser();
    this.moveParser = moveParser || new MoveParser();

    if (fen != undefined) {
      // FIX: send moveParser to fenParser in order to parse en passant square
      this.state = this.fenParser.parseFen(fen);
    } else {
      this.state = this.createGame();
    }
  }

  createGame(): GameState {
    return this.fenParser.parseFen(DEFAULT_FEN);
  }
}
