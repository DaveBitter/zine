"use client";

import { useEffect, useState } from "react";
import { RefreshCw, Trash2, ZoomIn } from "lucide-react";
import { useZineProject } from "@/hooks/zine-project-context";
import { MAX_SCALE, MIN_SCALE } from "@/lib/image-transform";
import { getPageAspectRatio } from "@/lib/page-aspect";
import { getPageLabel } from "@/lib/page-label";
import { LAYOUT_IDS, PAGE_LAYOUTS } from "@/lib/page-layouts";
import { PAPER_SIZES } from "@/lib/zine-layouts/paper-sizes";
import { PhotoSlot } from "./photo-slot";

interface PageCanvasEditorProps {
  logicalPage: number;
}

function LayoutIcon({ layoutId }: { layoutId: (typeof LAYOUT_IDS)[number] }) {
  const slots = PAGE_LAYOUTS[layoutId].slots;
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <rect x="0.5" y="0.5" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1" opacity={0.4} />
      {slots.map((s, i) => (
        <rect
          key={i}
          x={s.x * 24 + 1}
          y={s.y * 24 + 1}
          width={s.width * 24 - 2}
          height={s.height * 24 - 2}
          fill="currentColor"
          opacity={0.7}
        />
      ))}
    </svg>
  );
}

export function PageCanvasEditor({ logicalPage }: PageCanvasEditorProps) {
  const { project, setPageLayout, setSlotPhoto, removeSlotPhoto, updateTransform, setCaption } = useZineProject();
  const [activeSlot, setActiveSlot] = useState(0);

  const page = project?.pages.find((p) => p.logicalPage === logicalPage);

  useEffect(() => {
    setActiveSlot(0);
  }, [logicalPage]);

  useEffect(() => {
    if (page && activeSlot >= page.photos.length) setActiveSlot(0);
  }, [page, activeSlot]);

  if (!project || !page) return null;

  const aspect = getPageAspectRatio(project.format, PAPER_SIZES[project.paperId]);
  const label = getPageLabel(logicalPage, project.pageCount);
  const layout = PAGE_LAYOUTS[page.layout];
  const activePhoto = page.photos[activeSlot];

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-[var(--color-text)]">{label}</h2>

      <div className="flex gap-1">
        {LAYOUT_IDS.map((id) => (
          <button
            key={id}
            type="button"
            title={PAGE_LAYOUTS[id].label}
            onClick={() => setPageLayout(logicalPage, id)}
            className={`flex items-center justify-center rounded-md border p-1.5 ${
              page.layout === id
                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text-muted)]"
            }`}
          >
            <LayoutIcon layoutId={id} />
          </button>
        ))}
      </div>

      <div className="mx-auto w-full max-w-xs">
        <div
          className="relative overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)]"
          style={{ aspectRatio: aspect }}
        >
          {layout.slots.map((slot, i) => (
            <PhotoSlot
              key={i}
              logicalPage={logicalPage}
              slotIndex={i}
              slot={slot}
              photo={page.photos[i]}
              isActive={activeSlot === i}
              onActivate={() => setActiveSlot(i)}
            />
          ))}
        </div>
      </div>

      {layout.slots.length > 1 && (
        <p className="text-[10px] text-[var(--color-text-muted)]">
          Editing photo {activeSlot + 1} of {layout.slots.length} — click a photo above to select it.
        </p>
      )}

      {activePhoto && (
        <div className="mx-auto flex w-full max-w-xs flex-col gap-2">
          <label className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
            <ZoomIn size={14} className="shrink-0" />
            <input
              type="range"
              min={MIN_SCALE}
              max={MAX_SCALE}
              step={0.05}
              value={activePhoto.transform.scale}
              onChange={(e) =>
                updateTransform(logicalPage, activeSlot, { ...activePhoto.transform, scale: Number(e.target.value) })
              }
              className="flex-1"
            />
          </label>

          <div className="flex gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text)]">
              <RefreshCw size={13} />
              Replace
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void setSlotPhoto(logicalPage, activeSlot, file);
                  e.target.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => removeSlotPhoto(logicalPage, activeSlot)}
              className="flex items-center gap-1.5 rounded-md border border-[var(--color-border)] px-2 py-1 text-xs text-[var(--color-text)]"
            >
              <Trash2 size={13} />
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto w-full max-w-xs">
        <label className="flex flex-col gap-1 text-xs text-[var(--color-text-muted)]">
          Caption (optional)
          <input
            type="text"
            value={page.caption}
            onChange={(e) => setCaption(logicalPage, e.target.value)}
            maxLength={120}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-xs text-[var(--color-text)]"
          />
        </label>
      </div>
    </div>
  );
}
