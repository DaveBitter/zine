import { PDFDocument } from "pdf-lib";
import { buildLayoutForProject } from "@/lib/build-layout-for-project";
import type { ZineProject } from "@/lib/zine-project-types";
import { renderSheetToCanvas, type RenderMode } from "./renderSheetToCanvas";
import { downloadBlob } from "./downloadBlob";

const PT_PER_MM = 72 / 25.4;

function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error("Could not encode canvas as PNG"));
        return;
      }
      resolve(new Uint8Array(await blob.arrayBuffer()));
    }, "image/png");
  });
}

/**
 * Builds one print-ready PDF: one page per sheet-side, in physical print
 * order (sheet 1 front, sheet 1 back, sheet 2 front, ...), sized exactly to
 * the chosen paper size.
 */
export async function exportPdf(project: ZineProject, mode: RenderMode): Promise<void> {
  const layout = buildLayoutForProject(project);
  const pdfDoc = await PDFDocument.create();
  const pageWidthPt = layout.paper.width * PT_PER_MM;
  const pageHeightPt = layout.paper.height * PT_PER_MM;

  for (const sheet of layout.sheets) {
    const sides = sheet.back ? [sheet.front, sheet.back] : [sheet.front];
    for (const side of sides) {
      const canvas = await renderSheetToCanvas(side, layout.paper, project, mode);
      const pngBytes = await canvasToPngBytes(canvas);
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const page = pdfDoc.addPage([pageWidthPt, pageHeightPt]);
      page.drawImage(pngImage, { x: 0, y: 0, width: pageWidthPt, height: pageHeightPt });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const filename = mode === "guide" ? "zine-template.pdf" : "zine.pdf";
  downloadBlob(new Blob([pdfBytes as BlobPart], { type: "application/pdf" }), filename);
}
