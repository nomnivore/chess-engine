import { MoveParser } from "./move-parser.js";
import { Coordinate, GameState, isPieceCode, PieceCode } from "./types.js";

export class FenParser {
  // TODO: find a better way to pass dependencies
  parseFen(fen: string, moveParser = new MoveParser()): GameState {
    const segments = fen.split(" ") as [
      string,
      string,
      string,
      string,
      string,
      string,
    ];
    if (segments.length !== 6) throw new Error("Invalid FEN");

    let enPassant: Coordinate | undefined;

    try {
      enPassant = moveParser.squareToCoordinate(segments[3]);
    } catch (e: unknown) {
      enPassant = undefined;
    }

    return {
      board: this.boardFromSegment(segments[0]),
      whiteToMove: segments[1] === "w",
      castling: this.castleFromSegment(segments[2]),
      enPassant: enPassant,
      halfmoveClock: parseInt(segments[4]),
      fullmove: parseInt(segments[5]),
    };
  }

  toFen(state: GameState, moveParser = new MoveParser()): string {
    const fen: string[] = [];

    const fenPieces: string[] = [];

    for (const rank of state.board.toReversed()) {
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
    fen.push(fenPieces.join("/"), state.whiteToMove ? "w" : "b");

    let castles = "";
    if (state.castling.white.king) castles += "K";
    if (state.castling.white.queen) castles += "Q";
    if (state.castling.black.king) castles += "k";
    if (state.castling.black.queen) castles += "q";

    if (castles === "") castles = "-";

    let enPassant = "-";
    if (state.enPassant) {
      try {
        enPassant = moveParser.coordinateToSquare(state.enPassant);
      } catch (e: unknown) {
        console.log("Invalid en passant square");
      }
    }

    fen.push(
      castles,
      enPassant,
      state.halfmoveClock.toString(),
      state.fullmove.toString(),
    );

    return fen.join(" ");
  }

  createEmptyBoard(): PieceCode[][] {
    const board: PieceCode[][] = [];

    for (let i = 0; i < 8; i++) {
      board.push(new Array<PieceCode>(8).fill(null));
    }

    return board;
  }

  boardFromSegment(segment: string): PieceCode[][] {
    const board = this.createEmptyBoard();

    const ranks = segment.split("/");

    let fenRank = 0;
    for (let y = 7; y >= 0; y--) {
      const rank = ranks[fenRank];
      fenRank++;
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
    return board;
  }

  castleFromSegment(segment: string): GameState["castling"] {
    if (segment === "-")
      return {
        white: { king: false, queen: false },
        black: { king: false, queen: false },
      };
    return {
      white: {
        king: segment.includes("K"),
        queen: segment.includes("Q"),
      },
      black: {
        king: segment.includes("k"),
        queen: segment.includes("q"),
      },
    };
  }
}
