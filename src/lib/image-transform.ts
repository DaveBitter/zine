/**
 * Non-destructive photo placement within a page panel. `scale` is a
 * multiplier on top of the minimum "cover" scale (1 = smallest zoom that
 * still fills the box). `offsetX`/`offsetY` are in [-1, 1], representing how
 * far the image is panned from centred, as a fraction of the available
 * overflow at the current scale (0 = centred, -1/+1 = fully panned to one
 * edge). Because everything is normalised, the exact same transform value
 * produces identical results whether it drives a CSS style (live editor,
 * arbitrary box pixel size) or a canvas drawImage call (export, print
 * resolution) — the two never drift apart.
 */
export interface PhotoTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export const DEFAULT_PHOTO_TRANSFORM: PhotoTransform = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
};

export const MIN_SCALE = 1;
export const MAX_SCALE = 4;

export function clampTransform(t: PhotoTransform): PhotoTransform {
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, t.scale));
  return {
    scale,
    offsetX: Math.min(1, Math.max(-1, t.offsetX)),
    offsetY: Math.min(1, Math.max(-1, t.offsetY)),
  };
}

export function computeMaxOffsets(
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
  scale: number,
): { maxOffsetX: number; maxOffsetY: number } {
  const clampedScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
  const coverScale = Math.max(boxWidth / imageWidth, boxHeight / imageHeight);
  const drawScale = coverScale * clampedScale;
  const drawWidth = imageWidth * drawScale;
  const drawHeight = imageHeight * drawScale;
  return {
    maxOffsetX: Math.max(0, (drawWidth - boxWidth) / 2),
    maxOffsetY: Math.max(0, (drawHeight - boxHeight) / 2),
  };
}

export interface CoverDrawRect {
  /** Draw width/height of the image, in the same units as boxWidth/boxHeight. */
  drawWidth: number;
  drawHeight: number;
  /** Image top-left position, relative to the box's own top-left (0,0). */
  dx: number;
  dy: number;
}

/**
 * Computes where to draw an image so it covers a box of size
 * boxWidth x boxHeight, given a source image's natural size and a
 * PhotoTransform. Used identically by the live CSS-based editor (box size =
 * on-screen pixels) and the canvas export renderer (box size = print-DPI
 * pixels).
 */
export function computeCoverDraw(
  imageWidth: number,
  imageHeight: number,
  boxWidth: number,
  boxHeight: number,
  transform: PhotoTransform,
): CoverDrawRect {
  const { scale, offsetX, offsetY } = clampTransform(transform);
  const coverScale = Math.max(boxWidth / imageWidth, boxHeight / imageHeight);
  const drawScale = coverScale * scale;
  const drawWidth = imageWidth * drawScale;
  const drawHeight = imageHeight * drawScale;

  const maxOffsetX = Math.max(0, (drawWidth - boxWidth) / 2);
  const maxOffsetY = Math.max(0, (drawHeight - boxHeight) / 2);

  const dx = (boxWidth - drawWidth) / 2 + offsetX * maxOffsetX;
  const dy = (boxHeight - drawHeight) / 2 + offsetY * maxOffsetY;

  return { drawWidth, drawHeight, dx, dy };
}
