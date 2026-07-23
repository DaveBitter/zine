import type { PhotoTransform } from "./image-transform";
import type { PageLayoutId } from "./page-layouts";
import type { PaperSizeId } from "./zine-layouts/paper-sizes";
import type { ZineFormat } from "./zine-layouts/types";

export interface ProjectPhoto {
  id: string;
  objectUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  transform: PhotoTransform;
}

export interface ProjectPage {
  logicalPage: number;
  layout: PageLayoutId;
  /** One entry per slot in this page's layout; undefined = empty slot. */
  photos: (ProjectPhoto | undefined)[];
  caption: string;
}

export interface ZineProject {
  format: ZineFormat;
  paperId: PaperSizeId;
  pageCount: number;
  pages: ProjectPage[];
}
