/** A photo slot's position within a page, as a fraction (0..1) of the page's own box — independent of paper size or panel rotation. */
export interface LayoutSlot {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PageLayoutId = "1up" | "2up" | "2up-stack" | "3up" | "4up";

export interface PageLayout {
  id: PageLayoutId;
  label: string;
  slots: LayoutSlot[];
}

export const PAGE_LAYOUTS: Record<PageLayoutId, PageLayout> = {
  "1up": {
    id: "1up",
    label: "1 photo",
    slots: [{ x: 0, y: 0, width: 1, height: 1 }],
  },
  "2up": {
    id: "2up",
    label: "2 side by side",
    slots: [
      { x: 0, y: 0, width: 0.5, height: 1 },
      { x: 0.5, y: 0, width: 0.5, height: 1 },
    ],
  },
  "2up-stack": {
    id: "2up-stack",
    label: "2 stacked",
    slots: [
      { x: 0, y: 0, width: 1, height: 0.5 },
      { x: 0, y: 0.5, width: 1, height: 0.5 },
    ],
  },
  "3up": {
    id: "3up",
    label: "3 photos",
    slots: [
      { x: 0, y: 0, width: 0.5, height: 1 },
      { x: 0.5, y: 0, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
    ],
  },
  "4up": {
    id: "4up",
    label: "4 photos",
    slots: [
      { x: 0, y: 0, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0, width: 0.5, height: 0.5 },
      { x: 0, y: 0.5, width: 0.5, height: 0.5 },
      { x: 0.5, y: 0.5, width: 0.5, height: 0.5 },
    ],
  },
};

export const DEFAULT_LAYOUT_ID: PageLayoutId = "1up";

export const LAYOUT_IDS: PageLayoutId[] = ["1up", "2up", "2up-stack", "3up", "4up"];
