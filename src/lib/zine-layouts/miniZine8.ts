import type { GuideLine, Panel, PaperSize, Sheet, ZineLayout } from "./types";

/**
 * The classic "one sheet, one cut, no staples" mini zine: a single sheet is
 * divided into a 2-row x 4-column grid of 8 panels, folded into an
 * accordion, given one slit cut along the middle of the two centre columns,
 * then folded flat into an 8-page booklet.
 *
 * Standard construction (landscape sheet):
 *  1. Fold in half twice along the width to crease it into quarters, then unfold.
 *  2. Fold in half once along the height (does not get unfolded).
 *  3. With the sheet folded per step 2, cut along the vertical quarter creases'
 *     midpoint — i.e. a slit centred on the horizontal crease spanning only
 *     the two middle columns.
 *  4. Unfold fully, then push the left/right ends toward the centre and fold
 *     the resulting accordion into a flat booklet.
 *
 * PANEL_TABLE below is the widely-published standard page order for this
 * fold. It is the single highest-risk piece of this app: get a physical
 * print, cut, and fold it before shipping, and fix this table (only this
 * table) if the page order comes out wrong.
 */
const PANEL_TABLE: { logicalPage: number; rotationDeg: 0 | 180 }[][] = [
  // top row (columns left -> right), printed upside-down
  [
    { logicalPage: 7, rotationDeg: 180 },
    { logicalPage: 6, rotationDeg: 180 },
    { logicalPage: 5, rotationDeg: 180 },
    { logicalPage: 4, rotationDeg: 180 },
  ],
  // bottom row (columns left -> right), right-side up
  [
    { logicalPage: 8, rotationDeg: 0 },
    { logicalPage: 1, rotationDeg: 0 },
    { logicalPage: 2, rotationDeg: 0 },
    { logicalPage: 3, rotationDeg: 0 },
  ],
];

export function buildMiniZine8Layout(paper: PaperSize): ZineLayout {
  const cols = 4;
  const rows = 2;
  const panelWidth = paper.width / cols;
  const panelHeight = paper.height / rows;

  const panels: Panel[] = PANEL_TABLE.flatMap((row, rowIndex) =>
    row.map((entry, colIndex) => ({
      x: colIndex * panelWidth,
      y: rowIndex * panelHeight,
      width: panelWidth,
      height: panelHeight,
      rotationDeg: entry.rotationDeg,
      logicalPage: entry.logicalPage,
    })),
  );

  const midY = paper.height / 2;
  const colBoundaries = [0, panelWidth, panelWidth * 2, panelWidth * 3, paper.width];

  const guides: GuideLine[] = [
    // vertical fold creases, full height, at each column boundary (skip outer edges)
    ...[1, 2, 3].map(
      (i): GuideLine => ({
        kind: "fold",
        x1: colBoundaries[i],
        y1: 0,
        x2: colBoundaries[i],
        y2: paper.height,
      }),
    ),
    // horizontal fold crease, under the outer (uncut, hinge) columns only
    {
      kind: "fold",
      x1: colBoundaries[0],
      y1: midY,
      x2: colBoundaries[1],
      y2: midY,
    },
    {
      kind: "fold",
      x1: colBoundaries[3],
      y1: midY,
      x2: colBoundaries[4],
      y2: midY,
    },
    // the cut: a slit along the horizontal centre line spanning the two middle columns
    {
      kind: "cut",
      x1: colBoundaries[1],
      y1: midY,
      x2: colBoundaries[3],
      y2: midY,
    },
  ];

  const sheet: Sheet = {
    index: 1,
    front: { panels, guides },
  };

  return {
    format: "mini-zine-8",
    paper,
    totalPages: 8,
    sheets: [sheet],
  };
}
