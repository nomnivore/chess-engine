import { Coordinate, GameState, PieceCode } from "./types.js";

// OOP... bleh. but it does what I want it to, as long as its kept simple.
abstract class Piece {
  constructor(readonly white: boolean) {
    this.white = white;
  }

  abstract directions(): Coordinate[];

  possibleMoves(state: GameState, pos: Coordinate): Coordinate[] {
    const moves: Coordinate[] = [];

    this.directions().forEach((dir) => {
      let [x, y] = pos;
      const [dx, dy] = dir;
      let stop = false;
      while (!stop) {
        x += dx;
        y += dy;

        // first check if coord is out of bounds
        if (x < 0 || x > 7 || y < 0 || y > 7) {
          stop = true;
          continue;
        }

        // next check if there is a piece at the coord
        const pieceCode = state.board[x]![y];
        const piece = pieces.get(pieceCode || null);

        if (piece) {
          if (piece.white !== this.white) {
            moves.push([x, y]);
          }
          stop = true;
          continue;
        }

        if (pieceCode === null) {
          moves.push([x, y]);
        }
      }
    });

    return moves;
  }
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

  possibleMoves(state: GameState, pos: Coordinate): Coordinate[] {
    // copied from Knight, if there are issues, that is why!

    // TODO: add castling

    // TODO: add check detection, maybe this should be a filter in the legality checker?
    const moves: Coordinate[] = [];
    const [x, y] = pos;

    this.directions().forEach((dir) => {
      const [dx, dy] = dir;

      const newX = x + dx;
      const newY = y + dy;

      // check out of bounds
      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) return;

      const pieceCode = state.board[newX]![newY];

      // check if friendly piece
      if (pieceCode && pieces.get(pieceCode)?.white === this.white) return;

      moves.push([newX, newY]);
    });

    return moves;
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

  possibleMoves(state: GameState, pos: Coordinate): Coordinate[] {
    const moves: Coordinate[] = [];
    const [x, y] = pos;

    this.directions().forEach((dir) => {
      const [dx, dy] = dir;

      const newX = x + dx;
      const newY = y + dy;

      // check out of bounds
      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) return;

      const pieceCode = state.board[newX]![newY];

      // check if friendly piece
      if (pieceCode && pieces.get(pieceCode)?.white === this.white) return;

      moves.push([newX, newY]);
    });

    return moves;
  }
}

class Pawn extends Piece {
  directions(): Coordinate[] {
    // TODO: add an extra direction based on starting square / capture
    // in some move generation function
    if (this.white) {
      return [[1, 0]];
    }

    return [[-1, 0]];
  }

  possibleMoves(state: GameState, pos: Coordinate): Coordinate[] {
    const moves: Coordinate[] = [];
    const [x, y] = pos;
    const cmod = this.white ? 1 : -1;

    const extraDirs = this.directions();
    if ((this.white && x === 1) || (!this.white && x === 6)) {
      extraDirs.push([2 * cmod, 0]);
    }

    extraDirs.forEach((dir) => {
      const [dx, dy] = dir;
      const newX = x + dx;
      const newY = y + dy;

      // check out of bounds
      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) return;

      const pieceCode = state.board[newX]![newY];
      // if there is any piece, we can't move there
      if (pieceCode) return;

      moves.push([newX, newY]);
    });

    // captures
    const captureDirs: Coordinate[] = [
      [1 * cmod, 1],
      [1 * cmod, -1],
    ];

    captureDirs.forEach((dir) => {
      const [dx, dy] = dir;
      const newX = x + dx;
      const newY = y + dy;

      // check out of bounds
      if (newX < 0 || newX > 7 || newY < 0 || newY > 7) return;

      const pieceCode = state.board[newX]![newY];

      // if there's no piece, we can't move there
      if (!pieceCode) return;

      const piece = pieces.get(pieceCode);

      if (piece && piece.white !== this.white) {
        moves.push([newX, newY]);
      }
    });

    // en passant
    if (state.enPassant) {
      // check if en passant is diagonal to the pawn
      // en passant records the square behind the pawn that moved
      const [ex, ey] = state.enPassant;

      // untested
      if (ey === y + 1 || ey === y - 1) {
        // check if en passant is in the direction of the pawn
        if ((this.white && ex === x + 1) || (!this.white && ex === x - 1)) {
          // check if there is an enemy pawn there
          const pieceCode = state.board[ex]![ey];
          const piece = pieces.get(pieceCode || null);

          if (piece && piece.white !== this.white && piece instanceof Pawn)
            moves.push([ex, ey]);
        }
      }
    }

    return moves;
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
