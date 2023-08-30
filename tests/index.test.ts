import { FenParser } from "../src/fen-parser.js";

describe("FenParser", () => {
  it("should parse and re-serialize a FEN", () => {
    const fen =
      "rnbqk2r/pp2ppbp/2p2np1/3p4/3P4/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 7";

    const parser = new FenParser();
    const state = parser.parseFen(fen);

    expect(parser.toFen(state)).toEqual(fen);
  });
});
