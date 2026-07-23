import { computeCoverDraw } from "@/lib/image-transform";
import { getFoldMarkers } from "@/lib/guide-markers";
import { loadImage } from "@/lib/load-image";
import { getPageLabel } from "@/lib/page-label";
import { PAGE_LAYOUTS } from "@/lib/page-layouts";
import type { PaperSize, Panel, SheetSide } from "@/lib/zine-layouts/types";
import type { ZineProject } from "@/lib/zine-project-types";

export const EXPORT_DPI = 300;
const MM_PER_INCH = 25.4;

/** "content" = the finished zine, photos only, no lines. "guide" = the blank fold/cut template with page numbers, no photos. */
export type RenderMode = "content" | "guide";

export function mmToPx(mm: number, dpi = EXPORT_DPI): number {
  return Math.round((mm / MM_PER_INCH) * dpi);
}

async function drawContentPanel(
  ctx: CanvasRenderingContext2D,
  panel: Panel,
  project: ZineProject,
  scale: number,
) {
  const px = { x: panel.x * scale, y: panel.y * scale, width: panel.width * scale, height: panel.height * scale };
  const page = project.pages.find((p) => p.logicalPage === panel.logicalPage);

  ctx.save();
  ctx.beginPath();
  ctx.rect(px.x, px.y, px.width, px.height);
  ctx.clip();

  // blank padding page: neutral fill, no text — this is meant to be final artwork
  ctx.fillStyle = "#f2f1ec";
  ctx.fillRect(px.x, px.y, px.width, px.height);

  if (panel.logicalPage !== 0 && page) {
    const cx = px.x + px.width / 2;
    const cy = px.y + px.height / 2;
    if (panel.rotationDeg === 180) {
      ctx.translate(cx, cy);
      ctx.rotate(Math.PI);
      ctx.translate(-cx, -cy);
    }

    const slots = PAGE_LAYOUTS[page.layout].slots;
    for (let i = 0; i < slots.length; i++) {
      const slot = slots[i];
      const photo = page.photos[i];
      if (!photo) continue;
      const slotX = px.x + slot.x * px.width;
      const slotY = px.y + slot.y * px.height;
      const slotWidth = slot.width * px.width;
      const slotHeight = slot.height * px.height;

      const img = await loadImage(photo.objectUrl);
      const rect = computeCoverDraw(img.naturalWidth, img.naturalHeight, slotWidth, slotHeight, photo.transform);
      ctx.save();
      ctx.beginPath();
      ctx.rect(slotX, slotY, slotWidth, slotHeight);
      ctx.clip();
      ctx.drawImage(img, slotX + rect.dx, slotY + rect.dy, rect.drawWidth, rect.drawHeight);
      ctx.restore();
    }

    if (page.caption) {
      const barHeight = px.height * 0.14;
      ctx.fillStyle = "rgba(0,0,0,0.45)";
      ctx.fillRect(px.x, px.y + px.height - barHeight, px.width, barHeight);
      ctx.fillStyle = "#fff";
      ctx.font = `${Math.round(px.height * 0.06)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(page.caption, cx, px.y + px.height - barHeight / 2, px.width * 0.92);
    }
  }

  ctx.restore();
}

function drawGuidePanel(ctx: CanvasRenderingContext2D, panel: Panel, project: ZineProject, scale: number) {
  const px = { x: panel.x * scale, y: panel.y * scale, width: panel.width * scale, height: panel.height * scale };
  ctx.save();
  ctx.strokeStyle = "#c9c6ba";
  ctx.lineWidth = Math.max(1, scale * 0.15);
  ctx.strokeRect(px.x, px.y, px.width, px.height);

  if (panel.logicalPage !== 0) {
    const cx = px.x + px.width / 2;
    const cy = px.y + px.height / 2;
    ctx.fillStyle = "#57554e";
    ctx.font = `${Math.round(px.height * 0.07)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(getPageLabel(panel.logicalPage, project.pageCount), cx, cy);
  }
  ctx.restore();
}

function drawGuideLines(ctx: CanvasRenderingContext2D, side: SheetSide, scale: number, paperHeightMm: number) {
  for (const guide of side.guides) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(guide.x1 * scale, guide.y1 * scale);
    ctx.lineTo(guide.x2 * scale, guide.y2 * scale);
    if (guide.kind === "cut") {
      ctx.strokeStyle = "#c1440e";
      ctx.lineWidth = Math.max(1, scale * 0.35);
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = "#3355c9";
      ctx.lineWidth = Math.max(1, scale * 0.3);
      ctx.setLineDash([scale * 1.2, scale * 1]);
    }
    ctx.stroke();
    ctx.restore();

    if (guide.kind === "cut") {
      const midX = ((guide.x1 + guide.x2) / 2) * scale;
      const midY = guide.y1 * scale;
      ctx.save();
      ctx.fillStyle = "#c1440e";
      ctx.font = `${Math.round(paperHeightMm * scale * 0.045)}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("✂", midX, midY);
      ctx.restore();
    }
  }

  const paperWidthMm = ctx.canvas.width / scale;
  for (const marker of getFoldMarkers(side.guides, paperWidthMm, paperHeightMm)) {
    ctx.save();
    ctx.fillStyle = "#3355c9";
    ctx.font = `${Math.round(paperHeightMm * scale * 0.035)}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(marker.glyph, marker.x * scale, marker.y * scale);
    ctx.restore();
  }
}

/** Small legend printed in a bottom corner of the guide sheet so it's self-explanatory once on paper, away from the app UI. Only lists the guide kinds actually present on this sheet side (saddle-stitch sheets have no cut line, for example). */
function drawLegend(ctx: CanvasRenderingContext2D, side: SheetSide, scale: number, paperHeightMm: number) {
  const hasFold = side.guides.some((g) => g.kind === "fold");
  const hasCut = side.guides.some((g) => g.kind === "cut");
  if (!hasFold && !hasCut) return;

  const fontSize = Math.round(paperHeightMm * scale * 0.022);
  const margin = paperHeightMm * scale * 0.02;
  const x = margin;
  const bottomY = ctx.canvas.height - margin;

  ctx.save();
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  if (hasFold) {
    ctx.fillStyle = "#3355c9";
    ctx.fillText("- - - fold", x, hasCut ? bottomY - fontSize * 1.4 : bottomY);
  }
  if (hasCut) {
    ctx.fillStyle = "#c1440e";
    ctx.fillText("— cut ✂", x, bottomY);
  }
  ctx.restore();
}

/**
 * Renders one physical sheet side to an offscreen canvas at print
 * resolution, using the exact same geometry engine output as the live
 * SheetPreview — the two can never disagree on layout.
 *
 * "content" mode draws photos/captions only, no guide lines, ever — this is
 * the actual zine artwork. "guide" mode draws a blank panel grid with page
 * numbers and the fold/cut lines, no photos — a separate downloadable
 * reference sheet for lining up the physical fold and cut.
 */
export async function renderSheetToCanvas(
  side: SheetSide,
  paper: PaperSize,
  project: ZineProject,
  mode: RenderMode,
): Promise<HTMLCanvasElement> {
  const scale = EXPORT_DPI / MM_PER_INCH;
  const canvas = document.createElement("canvas");
  canvas.width = mmToPx(paper.width);
  canvas.height = mmToPx(paper.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get a 2D canvas context");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (mode === "content") {
    for (const panel of side.panels) {
      await drawContentPanel(ctx, panel, project, scale);
    }
  } else {
    for (const panel of side.panels) {
      drawGuidePanel(ctx, panel, project, scale);
    }
    drawGuideLines(ctx, side, scale, paper.height);
    drawLegend(ctx, side, scale, paper.height);
  }

  return canvas;
}
