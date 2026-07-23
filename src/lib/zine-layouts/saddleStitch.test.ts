import { describe, expect, it } from "vitest";
import { PAPER_SIZES } from "./paper-sizes";
import { buildSaddleStitchLayout, roundUpToMultipleOf4, saddleStitchPageOrder } from "./saddleStitch";

describe("saddleStitchPageOrder", () => {
  it("matches the hand-verified 8-page order", () => {
    expect(saddleStitchPageOrder(8)).toEqual([
      [8, 1, 2, 7],
      [6, 3, 4, 5],
    ]);
  });

  it("matches the hand-verified 16-page order", () => {
    // sheet i: front-left=P-2i+2, front-right=2i-1, back-left=2i, back-right=P-2i+1
    expect(saddleStitchPageOrder(16)).toEqual([
      [16, 1, 2, 15],
      [14, 3, 4, 13],
      [12, 5, 6, 11],
      [10, 7, 8, 9],
    ]);
  });

  it("rejects page counts that are not a multiple of 4", () => {
    expect(() => saddleStitchPageOrder(10)).toThrow();
  });

  it("every page 1..P appears exactly once across all sheets", () => {
    for (const pageCount of [4, 8, 12, 20, 32]) {
      const seen = saddleStitchPageOrder(pageCount).flat().sort((a, b) => a - b);
      expect(seen).toEqual(Array.from({ length: pageCount }, (_, i) => i + 1));
    }
  });
});

describe("roundUpToMultipleOf4", () => {
  it("rounds up", () => {
    expect(roundUpToMultipleOf4(18)).toBe(20);
    expect(roundUpToMultipleOf4(16)).toBe(16);
    expect(roundUpToMultipleOf4(1)).toBe(4);
  });
});

describe("buildSaddleStitchLayout", () => {
  it("pads with blank (logicalPage 0) pages beyond the requested count", () => {
    const layout = buildSaddleStitchLayout(PAPER_SIZES.a4, 18);
    expect(layout.totalPages).toBe(18);
    expect(layout.sheets).toHaveLength(5); // 20 pages / 4

    const allLogicalPages = layout.sheets.flatMap((s) => [
      ...s.front.panels.map((p) => p.logicalPage),
      ...(s.back?.panels.map((p) => p.logicalPage) ?? []),
    ]);
    const blanks = allLogicalPages.filter((p) => p === 0);
    const real = allLogicalPages.filter((p) => p !== 0).sort((a, b) => a - b);

    expect(blanks).toHaveLength(2);
    expect(real).toEqual(Array.from({ length: 18 }, (_, i) => i + 1));
  });

  it("gives every panel the full sheet height and half the width", () => {
    const layout = buildSaddleStitchLayout(PAPER_SIZES.a4, 8);
    for (const sheet of layout.sheets) {
      for (const panel of [...sheet.front.panels, ...(sheet.back?.panels ?? [])]) {
        expect(panel.height).toBe(PAPER_SIZES.a4.height);
        expect(panel.width).toBeCloseTo(PAPER_SIZES.a4.width / 2);
      }
    }
  });
});
