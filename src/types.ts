export const pieceCodes = [
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

export type PieceCode = (typeof pieceCodes)[number];

export function isPieceCode(value: unknown): value is PieceCode {
  return pieceCodes.includes(value as PieceCode);
}

export type ChessGame = {
  board: PieceCode[][];
  whiteToMove: boolean;
  castling: {
    white: {
      king: boolean;
      queen: boolean;
    };
    black: {
      king: boolean;
      queen: boolean;
    };
  };
  enPassant: string;
  halfmoveClock: number;
  fullmove: number;
};

export type Coordinate = [number, number];

export type Instruction = {
  pieceToMove: PieceCode;
  to: Coordinate;
  from?: Coordinate;
  capture?: boolean;
  promotion?: boolean;
  check?: boolean;
  checkmate?: boolean;
};
