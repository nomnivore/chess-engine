import { Coordinate, PieceCode } from "./types.js";

// OOP... bleh. but it does what I want it to, as long as its kept simple.
abstract class Piece {
  constructor(readonly white: boolean) {
    this.white = white;
  }

  abstract directions(): Coordinate[];
}

const rookDirs: Coordinate[] = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

const bishopDirs: Coordinate[] = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
];

class Rook extends Piece {
  directions(): Coordinate[] {
    return rookDirs;
  }
}

class Bishop extends Piece {
  directions(): Coordinate[] {
    return bishopDirs;
  }
}

class Queen extends Piece {
  directions(): Coordinate[] {
    return [...rookDirs, ...bishopDirs];
  }
}

class King extends Piece {
  directions(): Coordinate[] {
    return [...rookDirs, ...bishopDirs];
  }
}

class Knight extends Piece {
  directions(): Coordinate[] {
    return [
      [2, 1],
      [1, 2],
      [-2, 1],
      [-1, 2],
      [2, -1],
      [1, -2],
      [-2, -1],
      [-1, -2],
    ];
  }
}

class Pawn extends Piece {
  directions(): Coordinate[] {
    // TODO: add an extra direction based on starting square / capture
    // in some move generation function
    return [[1, 0]];
  }
}

// create a collection of pieces and store in a map by PieceCode
export const pieces = new Map<PieceCode, Piece>();

pieces.set("p", new Pawn(false));
pieces.set("n", new Knight(false));
pieces.set("b", new Bishop(false));
pieces.set("r", new Rook(false));
pieces.set("q", new Queen(false));
pieces.set("k", new King(false));

pieces.set("P", new Pawn(true));
pieces.set("N", new Knight(true));
pieces.set("B", new Bishop(true));
pieces.set("R", new Rook(true));
pieces.set("Q", new Queen(true));
pieces.set("K", new King(true));
