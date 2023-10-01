import { Coordinate, Instruction, Optional, isPieceCode } from "./types.js";

export class MoveParser {
  /**
   * @param square - square notation e.g. "a1" or "h8"
   * @returns [rank, file] as number[]

    throws error if square is invalid
   */
  squareToCoordinate(square: string): Coordinate {
    if (square.length !== 2) throw new Error("Invalid square");
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]!) - 1;

    if (file < 0 || file > 7 || rank < 0 || rank > 7)
      throw new Error("Invalid square");

    return [rank, file];
  }

  /**
   * @param coordinate - [rank, file] as number[]
   * @returns e.g. [0, 0] -> "a1"

    throws error if coordinate is invalid
   */
  coordinateToSquare(coordinate: Coordinate): string {
    if (coordinate.length !== 2) throw new Error("Invalid coordinate");
    const [rank, file] = coordinate;
    if (file < 0 || file > 7 || rank < 0 || rank > 7)
      throw new Error("Invalid coordinate");
    const square = `${String.fromCharCode(file + 97)}${rank + 1}`;
    return square;
  }

  parseLan(lan: string): Instruction {
    // ignore dashes, spaces, captures, checks, checkmates
    lan = lan.replace(/[- x+#]+/g, "");

    if (lan.length < 4) throw new Error("Invalid LAN");

    const props: Optional<Instruction> = {};

    props.from = this.squareToCoordinate(lan.slice(0, 2));
    props.to = this.squareToCoordinate(lan.slice(2, 4));

    if (lan.length === 5) {
      if (isPieceCode(lan[4])) {
        props.promotion = lan[4];
      }
    }

    return props as Instruction;
  }
}
