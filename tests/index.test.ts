import { FenParser } from "../src/fen-parser.js";
import { DEFAULT_FEN } from "../src/index.js";

describe("FenParser", () => {
  it("should parse and re-serialize a FEN", () => {
    const fen =
      "rnbqk2r/pp2ppbp/2p2np1/3p4/3P4/2N2N2/PPP1PPPP/R1BQKB1R w KQkq - 0 7";
    const parser = new FenParser();
    const state = parser.parseFen(fen);

    expect(parser.toFen(state)).toEqual(fen);
  });

  it("should parse white pieces into ranks 1 and 2 (idx 0 and 1)", () => {
    const parser = new FenParser();
    const state = parser.parseFen(DEFAULT_FEN);

    expect(state.board[0]).toEqual(["r", "n", "b", "q", "k", "b", "n", "r"]);
    expect(state.board[1]).toEqual(["p", "p", "p", "p", "p", "p", "p", "p"]);
  });

  it("should parse black pieces into ranks 7 and 8 (idx 6 and 7)", () => {
    const parser = new FenParser();
    const state = parser.parseFen(DEFAULT_FEN);

    expect(state.board[6]).toEqual(["P", "P", "P", "P", "P", "P", "P", "P"]);
    expect(state.board[7]).toEqual(["R", "N", "B", "Q", "K", "B", "N", "R"]);
  });

  it("should parse empty squares as null", () => {
    const parser = new FenParser();
    const state = parser.parseFen(DEFAULT_FEN);

    expect(state.board[4]).toEqual([
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ]);
  });

  it("should parse the active color", () => {
    const parser = new FenParser();
    const state = parser.parseFen(DEFAULT_FEN);

    expect(state.whiteToMove).toBe(true);
  });

  it("should parse castling availability", () => {
    const parser = new FenParser();
    const state = parser.parseFen(DEFAULT_FEN);

    expect(state.castling).toEqual({
      white: {
        king: true,
        queen: true,
      },
      black: {
        king: true,
        queen: true,
      },
    });
  });
});
