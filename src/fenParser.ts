import { ChessGame, isPieceCode, PieceCode } from "./types.js";

export class FenParser {
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

  toFen(state: ChessGame): string {
    const fen: string[] = [];

    const fenPieces: string[] = [];

    for (const rank of state.board) {
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

    if (state.castling.black === "-" && state.castling.white === "-") {
      fen.push("-");
    } else {
      let castles = "";
      if (state.castling.white !== "-") castles += state.castling.white;
      if (state.castling.black !== "-") castles += state.castling.black;

      fen.push(castles);
    }

    fen.push(
      state.enPassant,
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
}
