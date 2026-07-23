import type { GuideLine, Mm } from "./zine-layouts/types";

/** A small arrowhead pointing at a fold line, placed on the guide sheet so "dashed line" reads as "fold here" without a separate legend. */
export interface FoldMarker {
  x: Mm;
  y: Mm;
  glyph: "▸" | "◂" | "▾" | "▴";
}

const MIN_LENGTH_FOR_MARKERS = 4; // mm — skip segments too short to fit a marker pair legibly

/**
 * Derives arrowhead marker positions for every fold guide line, pointing at
 * the crease from both sides. Used identically by the live SVG preview and
 * the canvas export so the two never show different fold guidance.
 */
export function getFoldMarkers(guides: GuideLine[], paperWidth: Mm, paperHeight: Mm): FoldMarker[] {
  const offset = Math.min(paperWidth, paperHeight) * 0.018;
  const markers: FoldMarker[] = [];

  for (const guide of guides) {
    if (guide.kind !== "fold") continue;
    const isVertical = guide.x1 === guide.x2;

    if (isVertical) {
      const length = Math.abs(guide.y2 - guide.y1);
      if (length < MIN_LENGTH_FOR_MARKERS) continue;
      const y = guide.y1 + length * 0.28;
      markers.push({ x: guide.x1 - offset, y, glyph: "▸" });
      markers.push({ x: guide.x1 + offset, y, glyph: "◂" });
    } else {
      const length = Math.abs(guide.x2 - guide.x1);
      if (length < MIN_LENGTH_FOR_MARKERS) continue;
      const x = guide.x1 + length * 0.5;
      markers.push({ x, y: guide.y1 - offset, glyph: "▾" });
      markers.push({ x, y: guide.y1 + offset, glyph: "▴" });
    }
  }

  return markers;
}
