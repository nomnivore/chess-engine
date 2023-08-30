import { FenParser } from "./fen-parser.js";
import { ChessGame } from "./types.js";

export const DEFAULT_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export class Engine {
  public fenParser: FenParser;
  public state: ChessGame;

  constructor(fenParser: FenParser, fen?: string) {
    if (fen != undefined) {
      this.state = fenParser.parseFen(fen);
    } else {
      this.state = this.createGame();
    }

    this.fenParser = fenParser;
  }

  createGame(): ChessGame {
    return this.fenParser.parseFen(DEFAULT_FEN);
  }
}
