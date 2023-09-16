import { MoveParser } from "../src/move-parser.js";

describe("MoveParser", () => {
  describe("squareToCoordinate", () => {
    it("should convert a square to a coordinate", () => {
      const parser = new MoveParser();

      expect(parser.squareToCoordinate("a1")).toEqual([0, 0]);
    });

    it("should throw an error if the square is invalid", () => {
      const parser = new MoveParser();

      expect(() => parser.squareToCoordinate("notasquare")).toThrow();
      expect(() => parser.squareToCoordinate("a9")).toThrow();
      expect(() => parser.squareToCoordinate("i3")).toThrow();
    });
  });

  describe("parseLan", () => {
    it("should parse a LAN move", () => {
      const parser = new MoveParser();

      expect(parser.parseLan("a2a4")).toEqual({ from: [1, 0], to: [3, 0] });
    });

    it("should throw an error if the LAN move is invalid", () => {
      const parser = new MoveParser();

      expect(() => parser.parseLan("a2a9")).toThrow();
      expect(() => parser.parseLan("a2a")).toThrow();
    });

    it("should parse a promotion", () => {
      const parser = new MoveParser();

      expect(parser.parseLan("a7a8q")).toEqual({
        from: [6, 0],
        to: [7, 0],
        promotion: "q",
      });
    });

    it("should ignore dashes, spaces, captures, checks, and checkmates", () => {
      const parser = new MoveParser();

      expect(parser.parseLan("b2-b4")).toEqual({ from: [1, 1], to: [3, 1] });
      expect(parser.parseLan("b2 b4")).toEqual({ from: [1, 1], to: [3, 1] });
      expect(parser.parseLan("a2xa4")).toEqual({ from: [1, 0], to: [3, 0] });
      expect(parser.parseLan("a2xa4+")).toEqual({ from: [1, 0], to: [3, 0] });
      expect(parser.parseLan("a2xa4#")).toEqual({ from: [1, 0], to: [3, 0] });
      expect(parser.parseLan("a7a8q++")).toEqual({
        from: [6, 0],
        to: [7, 0],
        promotion: "q",
      });
    });
  });
});
