const pieceCodes = [
  "p",
  "n",
  "b",
  "r",
  "q",
  "k",
  "P",
  "N",
  "B",
  "R",
  "Q",
  "K",
  null,
] as const;

type PieceCode = (typeof pieceCodes)[number];
const DEFAULT_FEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

function isPieceCode(value: unknown): value is PieceCode {
  return pieceCodes.includes(value as PieceCode);
}

type ChessGame = {
  board: PieceCode[][];
  whiteToMove: boolean;
  castling: {
    white: "K" | "Q" | "KQ" | "-";
    black: "k" | "q" | "kq" | "-";
  };
  enPassant: string;
  halfmoveClock: number;
  fullmove: number;
};

export class Engine {
  public state: ChessGame;

  constructor(fen?: string) {
    if (fen != undefined) {
      this.state = this.parseFen(fen);
    } else {
      this.state = this.createGame();
    }
  }

  parseFen(fen: string): ChessGame {
    const segments = fen.split(" ");
    if (segments.length !== 6) throw new Error("Invalid FEN");

    const fenPieces = segments[0]!; // assertion due to the error checking above

    const board = this.createEmptyBoard();

    const ranks = fenPieces.split("/");

    for (let y = 0; y < ranks.length; y++) {
      const rank = ranks[y];
      let file = 0;

      if (rank === undefined || board[y] === undefined) continue; // ts
      for (const piece of rank) {
        if (!isNaN(parseInt(piece))) {
          file += parseInt(piece);
        } else if (isPieceCode(piece)) {
          board[y]![file] = piece; // TODO: remove assertion
          file += 1;
        }
      }
    }

    return {
      board: board,
      whiteToMove: segments[1]! === "w",
      enPassant: segments[3]!,
      halfmoveClock: parseInt(segments[4]!),
      fullmove: parseInt(segments[5]!),
      // TODO: parse castling
      castling: { white: "KQ", black: "kq" },
    };
  }

  toFen(): string {
    const fen: string[] = [];

    const fenPieces: string[] = [];

    for (const rank of this.state.board) {
      let rankFen = "";

      let skip = 0;
      for (const piece of rank) {
        if (piece) {
          if (skip > 0) rankFen += skip.toString();
          rankFen += piece;
          skip = 0;
        } else {
          skip += 1;
        }
      }

      if (skip > 0) rankFen += skip.toString();
      fenPieces.push(rankFen);
    }
    fen.push(fenPieces.join("/"));

    fen.push(this.state.whiteToMove ? "w" : "b");

    if (
      this.state.castling.black === "-" &&
      this.state.castling.white === "-"
    ) {
      fen.push("-");
    } else {
      let castles = "";
      if (this.state.castling.white !== "-")
        castles += this.state.castling.white;
      if (this.state.castling.black !== "-")
        castles += this.state.castling.black;

      fen.push(castles);
    }

    fen.push(this.state.enPassant);
    fen.push(this.state.halfmoveClock.toString());
    fen.push(this.state.fullmove.toString());

    return fen.join(" ");
  }

  createEmptyBoard(): PieceCode[][] {
    const board: PieceCode[][] = [];

    for (let i = 0; i < 8; i++) {
      board.push(new Array<PieceCode>(8).fill(null));
    }

    return board;
  }

  createGame(): ChessGame {
    return this.parseFen(DEFAULT_FEN);
  }
}
