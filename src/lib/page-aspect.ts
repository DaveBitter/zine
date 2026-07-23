import { buildMiniZine8Layout } from "./zine-layouts/miniZine8";
import { buildSaddleStitchLayout } from "./zine-layouts/saddleStitch";
import { PaperSize, ZineFormat } from "./zine-layouts/types";

/**
 * Derives a page's on-screen aspect ratio (width / height) straight from the
 * real geometry engine output, rather than duplicating the panel-size
 * formula here — so the editor's page boxes can never drift out of sync
 * with the actual printed panel dimensions.
 */
export function getPageAspectRatio(format: ZineFormat, paper: PaperSize): number {
  const layout = format === "mini-zine-8" ? buildMiniZine8Layout(paper) : buildSaddleStitchLayout(paper, 8);
  const panel = layout.sheets[0].front.panels[0];
  return panel.width / panel.height;
}
