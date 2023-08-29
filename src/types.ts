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
    white: "K" | "Q" | "KQ" | "-";
    black: "k" | "q" | "kq" | "-";
  };
  enPassant: string;
  halfmoveClock: number;
  fullmove: number;
};
