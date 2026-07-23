import type { PaperSize } from "./types";

/**
 * Only A4 ships in v1. Kept as a lookup table (not a hardcoded constant) so
 * A3/Letter/Legal are a one-line addition later — nothing else in the
 * geometry engine assumes A4 specifically.
 */
export const PAPER_SIZES = {
  a4: { id: "a4", name: "A4", width: 297, height: 210 } satisfies PaperSize,
} as const;

export type PaperSizeId = keyof typeof PAPER_SIZES;

export const DEFAULT_PAPER_SIZE_ID: PaperSizeId = "a4";
