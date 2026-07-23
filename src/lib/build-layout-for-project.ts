import { PAPER_SIZES } from "./zine-layouts/paper-sizes";
import { buildMiniZine8Layout } from "./zine-layouts/miniZine8";
import { buildSaddleStitchLayout } from "./zine-layouts/saddleStitch";
import type { ZineLayout } from "./zine-layouts/types";
import type { ZineProject } from "./zine-project-types";

/**
 * Single source of truth for turning a project's format/paper/page-count
 * into physical sheet geometry — used identically by the live SheetPreview
 * and the export pipeline so they can never disagree on layout.
 */
export function buildLayoutForProject(project: ZineProject): ZineLayout {
  const paper = PAPER_SIZES[project.paperId];
  return project.format === "mini-zine-8"
    ? buildMiniZine8Layout(paper)
    : buildSaddleStitchLayout(paper, project.pageCount);
}
