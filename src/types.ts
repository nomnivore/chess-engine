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

// used as a 'builder' type
export type Optional<T> = {
  [Property in keyof T]?: T[Property];
};

export type GameState = {
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
  enPassant?: Coordinate;
  halfmoveClock: number;
  fullmove: number;
};

export type Coordinate = [number, number];

export type Instruction = {
  pieceToMove?: PieceCode; // LAN removes the need for this   TODO: remove
  to: Coordinate;
  from: Coordinate;
  capture?: boolean;
  promotion?: PieceCode;
  check?: boolean;
  checkmate?: boolean;
};
