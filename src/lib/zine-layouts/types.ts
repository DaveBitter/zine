/** All measurements are in millimetres unless noted otherwise. */
export type Mm = number;

export interface PaperSize {
  id: string;
  name: string;
  width: Mm;
  height: Mm;
}

export type ZineFormat = "mini-zine-8" | "saddle-stitch";

/** A single page's placement on a physical sheet. `logicalPage` is 1-indexed reading order; 0 = blank padding page. */
export interface Panel {
  x: Mm;
  y: Mm;
  width: Mm;
  height: Mm;
  rotationDeg: 0 | 180;
  logicalPage: number;
}

export interface GuideLine {
  kind: "fold" | "cut";
  x1: Mm;
  y1: Mm;
  x2: Mm;
  y2: Mm;
}

export interface SheetSide {
  panels: Panel[];
  guides: GuideLine[];
}

export interface Sheet {
  /** 1-indexed position in the nested/accordion stack, outer sheet first. */
  index: number;
  front: SheetSide;
  /** Mini zine is printed single-sided; saddle-stitch sheets always have a back. */
  back?: SheetSide;
}

export interface ZineLayout {
  format: ZineFormat;
  paper: PaperSize;
  /** Total logical reading pages, including the front/back cover. Always includes any blank padding pages. */
  totalPages: number;
  sheets: Sheet[];
}
