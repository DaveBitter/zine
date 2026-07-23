"use client";

import { useZineProject } from "@/hooks/zine-project-context";
import { getPageLabel } from "@/lib/page-label";
import { getPageAspectRatio } from "@/lib/page-aspect";
import { PAGE_LAYOUTS } from "@/lib/page-layouts";
import { PAPER_SIZES } from "@/lib/zine-layouts/paper-sizes";
import { CroppedPhoto } from "./cropped-photo";

interface PageThumbnailListProps {
  activePage: number;
  onSelect: (logicalPage: number) => void;
}

export function PageThumbnailList({ activePage, onSelect }: PageThumbnailListProps) {
  const { project } = useZineProject();
  if (!project) return null;

  const aspect = getPageAspectRatio(project.format, PAPER_SIZES[project.paperId]);

  return (
    <ul className="flex max-h-[min(60vh,480px)] flex-col gap-1 overflow-y-auto pr-1">
      {project.pages.map((page) => (
        <li key={page.logicalPage}>
          <button
            type="button"
            onClick={() => onSelect(page.logicalPage)}
            className={`flex w-full items-center gap-2 rounded-lg border p-1.5 text-left transition ${
              activePage === page.logicalPage
                ? "border-[var(--color-accent)] bg-[var(--color-surface)]"
                : "border-transparent hover:bg-[var(--color-surface)]/60"
            }`}
          >
            <div
              className="relative shrink-0 overflow-hidden rounded border border-[var(--color-border)] bg-[var(--color-surface-muted)]"
              style={{ width: 26, aspectRatio: aspect }}
            >
              {PAGE_LAYOUTS[page.layout].slots.map((slot, i) => {
                const photo = page.photos[i];
                if (!photo) return null;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${slot.x * 100}%`,
                      top: `${slot.y * 100}%`,
                      width: `${slot.width * 100}%`,
                      height: `${slot.height * 100}%`,
                    }}
                  >
                    <CroppedPhoto
                      src={photo.objectUrl}
                      naturalWidth={photo.naturalWidth}
                      naturalHeight={photo.naturalHeight}
                      transform={photo.transform}
                      className="h-full w-full"
                    />
                  </div>
                );
              })}
            </div>
            <span className="text-xs text-[var(--color-text)]">
              {getPageLabel(page.logicalPage, project.pageCount)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
