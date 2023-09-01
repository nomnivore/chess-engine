import { FenParser } from "./fen-parser.js";
import { GameState } from "./types.js";

export const DEFAULT_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export class ChessGame {
  public fenParser: FenParser;
  public state: GameState;

  constructor(fenParser: FenParser = new FenParser(), fen?: string) {
    this.fenParser = fenParser;

    if (fen != undefined) {
      this.state = fenParser.parseFen(fen);
    } else {
      this.state = this.createGame();
    }
  }

  createGame(): GameState {
    return this.fenParser.parseFen(DEFAULT_FEN);
  }
}
