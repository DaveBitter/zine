import { describe, expect, it } from "vitest";
import { PAPER_SIZES } from "./paper-sizes";
import { buildMiniZine8Layout } from "./miniZine8";

describe("buildMiniZine8Layout", () => {
  const layout = buildMiniZine8Layout(PAPER_SIZES.a4);

  it("produces exactly one single-sided sheet with 8 panels", () => {
    expect(layout.totalPages).toBe(8);
    expect(layout.sheets).toHaveLength(1);
    expect(layout.sheets[0].back).toBeUndefined();
    expect(layout.sheets[0].front.panels).toHaveLength(8);
  });

  it("includes every page 1-8 exactly once", () => {
    const pages = layout.sheets[0].front.panels.map((p) => p.logicalPage).sort((a, b) => a - b);
    expect(pages).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("rotates the top row 180deg and leaves the bottom row upright", () => {
    for (const panel of layout.sheets[0].front.panels) {
      if (panel.y === 0) {
        expect(panel.rotationDeg).toBe(180);
      } else {
        expect(panel.rotationDeg).toBe(0);
      }
    }
  });

  it("tiles the full sheet with no gaps or overlaps (4 cols x 2 rows)", () => {
    const { width, height } = PAPER_SIZES.a4;
    const panels = layout.sheets[0].front.panels;
    expect(panels).toHaveLength(8);
    for (const panel of panels) {
      expect(panel.width).toBeCloseTo(width / 4);
      expect(panel.height).toBeCloseTo(height / 2);
    }
    const maxX = Math.max(...panels.map((p) => p.x + p.width));
    const maxY = Math.max(...panels.map((p) => p.y + p.height));
    expect(maxX).toBeCloseTo(width);
    expect(maxY).toBeCloseTo(height);
  });

  it("places exactly one cut guide spanning only the middle two columns", () => {
    const cuts = layout.sheets[0].front.guides.filter((g) => g.kind === "cut");
    expect(cuts).toHaveLength(1);
    const [cut] = cuts;
    expect(cut.x1).toBeCloseTo(width_quarter(1));
    expect(cut.x2).toBeCloseTo(width_quarter(3));
    expect(cut.y1).toBeCloseTo(PAPER_SIZES.a4.height / 2);
    expect(cut.y1).toBe(cut.y2);
  });
});

function width_quarter(n: number) {
  return (PAPER_SIZES.a4.width / 4) * n;
}
