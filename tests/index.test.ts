import { Engine } from "../src/index.js";

describe("Engine", () => {
  it("should parse and serialize a FEN", () => {
    const fen =
      "rnbqk2r/pp2ppbp/2p2np1/3p4/3P4/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 7";

    const engine = new Engine(fen);

    expect(engine.toFen()).toBe(fen);
  });
});
