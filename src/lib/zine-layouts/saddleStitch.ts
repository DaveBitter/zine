import type { GuideLine, Panel, PaperSize, Sheet, SheetSide, ZineLayout } from "./types";

/**
 * Standard 2-up saddle-stitch booklet imposition. Each landscape sheet is
 * printed double-sided and folded once down the middle; sheets nest inside
 * each other and are stapled along the spine after folding.
 *
 * For a booklet of P pages (P a multiple of 4) made of N = P/4 sheets,
 * sheet i (1-indexed, outermost first):
 *   front-left  = P - 2i + 2
 *   front-right = 2i - 1
 *   back-left   = 2i
 *   back-right  = P - 2i + 1
 *
 * Hand-verified for P=8 (N=2): sheet 1 front=[8,1] back=[2,7]; sheet 2
 * front=[6,3] back=[4,5] — matches standard booklet-imposition references.
 */
export function saddleStitchPageOrder(pageCount: number): number[][] {
  if (pageCount % 4 !== 0) {
    throw new Error("saddleStitchPageOrder requires pageCount to be a multiple of 4");
  }
  const sheetCount = pageCount / 4;
  const order: number[][] = [];
  for (let i = 1; i <= sheetCount; i++) {
    order.push([
      pageCount - 2 * i + 2, // front-left
      2 * i - 1, // front-right
      2 * i, // back-left
      pageCount - 2 * i + 1, // back-right
    ]);
  }
  return order;
}

export function roundUpToMultipleOf4(pageCount: number): number {
  return Math.ceil(pageCount / 4) * 4;
}

function buildSide(
  leftPage: number,
  rightPage: number,
  paper: PaperSize,
): SheetSide {
  const panelWidth = paper.width / 2;
  const panels: Panel[] = [
    { x: 0, y: 0, width: panelWidth, height: paper.height, rotationDeg: 0, logicalPage: leftPage },
    { x: panelWidth, y: 0, width: panelWidth, height: paper.height, rotationDeg: 0, logicalPage: rightPage },
  ];
  const guides: GuideLine[] = [
    { kind: "fold", x1: panelWidth, y1: 0, x2: panelWidth, y2: paper.height },
  ];
  return { panels, guides };
}

/**
 * @param requestedPageCount rounded up to the next multiple of 4 if needed;
 * any pages beyond the requested count are blank padding (logicalPage 0).
 */
export function buildSaddleStitchLayout(paper: PaperSize, requestedPageCount: number): ZineLayout {
  const totalPages = roundUpToMultipleOf4(Math.max(4, requestedPageCount));
  const order = saddleStitchPageOrder(totalPages);

  const blankBeyond = (page: number) => (page > requestedPageCount ? 0 : page);

  const sheets: Sheet[] = order.map(([frontLeft, frontRight, backLeft, backRight], idx) => ({
    index: idx + 1,
    front: buildSide(blankBeyond(frontLeft), blankBeyond(frontRight), paper),
    back: buildSide(blankBeyond(backLeft), blankBeyond(backRight), paper),
  }));

  return {
    format: "saddle-stitch",
    paper,
    totalPages: requestedPageCount,
    sheets,
  };
}
