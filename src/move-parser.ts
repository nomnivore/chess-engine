import { Coordinate, Instruction, Optional, isPieceCode } from "./types.js";

export class MoveParser {
  squareToCoordinate(square: string): Coordinate {
    if (square.length !== 2) throw new Error("Invalid square");
    const file = square.charCodeAt(0) - 97;
    const rank = parseInt(square[1]!) - 1;

    if (file < 0 || file > 7 || rank < 0 || rank > 7)
      throw new Error("Invalid square");

    return [rank, file];
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
