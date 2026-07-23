import { describe, expect, it } from "vitest";
import { computeCoverDraw } from "./image-transform";

describe("computeCoverDraw", () => {
  it("centres a wide image in a square box at scale 1 with no crop overflow on the fitted axis", () => {
    // image 200x100 (2:1) into a 100x100 box -> cover scale = 1 (100/200=0.5 vs 100/100=1, max=1)
    const rect = computeCoverDraw(200, 100, 100, 100, { scale: 1, offsetX: 0, offsetY: 0 });
    expect(rect.drawHeight).toBeCloseTo(100);
    expect(rect.drawWidth).toBeCloseTo(200);
    expect(rect.dy).toBeCloseTo(0);
    // width overflows by 100px total, centred -> dx = -50
    expect(rect.dx).toBeCloseTo(-50);
  });

  it("pans fully to one edge at offsetX = 1", () => {
    const rect = computeCoverDraw(200, 100, 100, 100, { scale: 1, offsetX: 1, offsetY: 0 });
    // max offset = (200-100)/2 = 50, dx = (100-200)/2 + 1*50 = -50+50 = 0
    expect(rect.dx).toBeCloseTo(0);
  });

  it("zooming in increases draw size beyond the box on both axes", () => {
    const base = computeCoverDraw(100, 100, 100, 100, { scale: 1, offsetX: 0, offsetY: 0 });
    const zoomed = computeCoverDraw(100, 100, 100, 100, { scale: 2, offsetX: 0, offsetY: 0 });
    expect(zoomed.drawWidth).toBeCloseTo(base.drawWidth * 2);
    expect(zoomed.drawHeight).toBeCloseTo(base.drawHeight * 2);
  });

  it("clamps out-of-range scale and offsets", () => {
    const rect = computeCoverDraw(100, 100, 100, 100, { scale: 999, offsetX: 5, offsetY: -5 });
    const clampedRect = computeCoverDraw(100, 100, 100, 100, { scale: 4, offsetX: 1, offsetY: -1 });
    expect(rect).toEqual(clampedRect);
  });
});
