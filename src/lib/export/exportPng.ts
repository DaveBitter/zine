import { buildLayoutForProject } from "@/lib/build-layout-for-project";
import type { ZineProject } from "@/lib/zine-project-types";
import { renderSheetToCanvas, type RenderMode } from "./renderSheetToCanvas";
import { downloadBlob } from "./downloadBlob";

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode canvas as PNG"))),
      "image/png",
    );
  });
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Downloads one PNG per sheet side. Sequential downloads (not zipped) to
 * avoid pulling in a zip dependency for v1 — fine for the handful of sheets
 * a zine typically has.
 */
export async function exportPng(project: ZineProject, mode: RenderMode): Promise<void> {
  const layout = buildLayoutForProject(project);
  let isFirst = true;
  const prefix = mode === "guide" ? "zine-template" : "zine";

  for (const sheet of layout.sheets) {
    const sides = sheet.back
      ? [
          { label: "front", side: sheet.front },
          { label: "back", side: sheet.back },
        ]
      : [{ label: "sheet", side: sheet.front }];

    for (const { label, side } of sides) {
      if (!isFirst) await delay(150); // stagger downloads so the browser doesn't block them as a popup burst
      isFirst = false;
      const canvas = await renderSheetToCanvas(side, layout.paper, project, mode);
      const blob = await canvasToPngBlob(canvas);
      const filename =
        layout.sheets.length > 1 ? `${prefix}-sheet-${sheet.index}-${label}.png` : `${prefix}-${label}.png`;
      downloadBlob(blob, filename);
    }
  }
}
