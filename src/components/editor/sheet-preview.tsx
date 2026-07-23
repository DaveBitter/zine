"use client";

import { useState } from "react";
import { Image, Scissors, Ruler, BookOpen } from "lucide-react";
import { computeCoverDraw } from "@/lib/image-transform";
import { getFoldMarkers } from "@/lib/guide-markers";
import { getPageLabel } from "@/lib/page-label";
import { PAGE_LAYOUTS } from "@/lib/page-layouts";
import type { Panel, Sheet, SheetSide } from "@/lib/zine-layouts/types";
import type { ZineProject } from "@/lib/zine-project-types";
import { buildLayoutForProject } from "@/lib/build-layout-for-project";
import { FoldStepsGuide } from "./fold-steps-guide";

const SCISSORS = "✂";

type PreviewMode = "content" | "guide" | "steps";

function GuidePanel({ panel, project }: { panel: Panel; project: ZineProject }) {
  const cx = panel.x + panel.width / 2;
  const cy = panel.y + panel.height / 2;
  return (
    <g>
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} fill="white" />
      {panel.logicalPage !== 0 && (
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={panel.height * 0.08}
          fill="var(--color-text-muted)"
        >
          {getPageLabel(panel.logicalPage, project.pageCount)}
        </text>
      )}
    </g>
  );
}

function ContentPanel({ panel, project }: { panel: Panel; project: ZineProject }) {
  const page = project.pages.find((p) => p.logicalPage === panel.logicalPage);
  const cx = panel.x + panel.width / 2;
  const cy = panel.y + panel.height / 2;
  const rotation = panel.rotationDeg ? `rotate(${panel.rotationDeg} ${cx} ${cy})` : undefined;

  if (panel.logicalPage === 0 || !page) {
    // blank padding page
    return (
      <rect x={panel.x} y={panel.y} width={panel.width} height={panel.height} fill="var(--color-surface-muted)" />
    );
  }

  const slots = PAGE_LAYOUTS[page.layout].slots;

  return (
    <g transform={rotation}>
      {slots.map((slot, i) => {
        const photo = page.photos[i];
        const slotX = panel.x + slot.x * panel.width;
        const slotY = panel.y + slot.y * panel.height;
        const slotWidth = slot.width * panel.width;
        const slotHeight = slot.height * panel.height;
        const clipId = `panel-clip-${panel.x}-${panel.y}-${panel.logicalPage}-${i}`;

        if (!photo) {
          return <rect key={i} x={slotX} y={slotY} width={slotWidth} height={slotHeight} fill="var(--color-surface-muted)" />;
        }

        const rect = computeCoverDraw(photo.naturalWidth, photo.naturalHeight, slotWidth, slotHeight, photo.transform);
        return (
          <g key={i}>
            <clipPath id={clipId}>
              <rect x={slotX} y={slotY} width={slotWidth} height={slotHeight} />
            </clipPath>
            <g clipPath={`url(#${clipId})`}>
              <image
                href={photo.objectUrl}
                x={slotX + rect.dx}
                y={slotY + rect.dy}
                width={rect.drawWidth}
                height={rect.drawHeight}
                preserveAspectRatio="none"
              />
            </g>
          </g>
        );
      })}
      {page.caption && (
        <>
          <rect
            x={panel.x}
            y={panel.y + panel.height - panel.height * 0.14}
            width={panel.width}
            height={panel.height * 0.14}
            fill="black"
            opacity={0.45}
          />
          <text
            x={cx}
            y={panel.y + panel.height - panel.height * 0.07}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={panel.height * 0.06}
            fill="white"
          >
            {page.caption}
          </text>
        </>
      )}
    </g>
  );
}

function SheetSideSvg({
  side,
  paper,
  project,
  mode,
  title,
}: {
  side: SheetSide;
  paper: { width: number; height: number };
  project: ZineProject;
  mode: PreviewMode;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-1 lg:h-full lg:min-h-0">
      <p className="shrink-0 text-xs text-[var(--color-text-muted)]">{title}</p>
      <svg
        viewBox={`0 0 ${paper.width} ${paper.height}`}
        preserveAspectRatio="xMidYMid meet"
        className="w-full lg:min-h-0 lg:flex-1"
        style={{ aspectRatio: `${paper.width} / ${paper.height}` }}
      >
        <rect x={0} y={0} width={paper.width} height={paper.height} fill="white" stroke="var(--color-border)" strokeWidth={0.5} />
        {side.panels.map((panel) =>
          mode === "guide" ? (
            <GuidePanel key={`${panel.x}-${panel.y}-${panel.logicalPage}`} panel={panel} project={project} />
          ) : (
            <ContentPanel key={`${panel.x}-${panel.y}-${panel.logicalPage}`} panel={panel} project={project} />
          ),
        )}

        {mode === "guide" &&
          side.guides.map((guide, i) => (
            <line
              key={i}
              x1={guide.x1}
              y1={guide.y1}
              x2={guide.x2}
              y2={guide.y2}
              stroke={guide.kind === "cut" ? "#c1440e" : "#3355c9"}
              strokeWidth={guide.kind === "cut" ? 0.8 : 0.7}
              className={guide.kind === "fold" ? "fold-dash" : undefined}
            />
          ))}

        {mode === "guide" &&
          side.guides
            .filter((g) => g.kind === "cut")
            .map((g, i) => (
              <text
                key={`scissors-${i}`}
                x={(g.x1 + g.x2) / 2}
                y={g.y1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={paper.height * 0.045}
                fill="#c1440e"
              >
                {SCISSORS}
              </text>
            ))}

        {mode === "guide" &&
          getFoldMarkers(side.guides, paper.width, paper.height).map((m, i) => (
            <text
              key={`fold-marker-${i}`}
              x={m.x}
              y={m.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={paper.height * 0.035}
              fill="#3355c9"
            >
              {m.glyph}
            </text>
          ))}
      </svg>
      {mode === "guide" && (
        <p className="flex shrink-0 items-center gap-3 text-xs text-[var(--color-text-muted)]">
          {side.guides.some((g) => g.kind === "fold") && (
            <span className="flex items-center gap-1">
              <span className="inline-block h-0 w-4 border-t-2 border-dashed" style={{ borderColor: "#3355c9" }} />
              fold
            </span>
          )}
          {side.guides.some((g) => g.kind === "cut") && (
            <span className="flex items-center gap-1">
              <span className="inline-block h-0 w-4 border-t-2" style={{ borderColor: "#c1440e" }} />
              cut
              <Scissors size={12} />
            </span>
          )}
        </p>
      )}
    </div>
  );
}

interface SheetPreviewProps {
  project: ZineProject;
}

export function SheetPreview({ project }: SheetPreviewProps) {
  const layout = buildLayoutForProject(project);
  const [mode, setMode] = useState<PreviewMode>("content");

  return (
    <div className="flex flex-col gap-2 lg:h-full lg:min-h-0">
      <div className="inline-flex w-fit shrink-0 gap-1 rounded-lg border border-[var(--color-border)] p-1">
        <button
          type="button"
          onClick={() => setMode("content")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-sm ${mode === "content" ? "bg-[var(--color-accent)] text-[var(--color-accent-contrast)]" : "text-[var(--color-text-muted)]"}`}
        >
          <Image size={14} />
          Photos
        </button>
        <button
          type="button"
          onClick={() => setMode("guide")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-sm ${mode === "guide" ? "bg-[var(--color-accent)] text-[var(--color-accent-contrast)]" : "text-[var(--color-text-muted)]"}`}
        >
          <Ruler size={14} />
          Template
        </button>
        <button
          type="button"
          onClick={() => setMode("steps")}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-sm ${mode === "steps" ? "bg-[var(--color-accent)] text-[var(--color-accent-contrast)]" : "text-[var(--color-text-muted)]"}`}
        >
          <BookOpen size={14} />
          Guide
        </button>
      </div>

      {mode === "steps" ? (
        <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          <FoldStepsGuide format={project.format} />
        </div>
      ) : (
        <div className="flex flex-col gap-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
          {layout.sheets.map((sheet: Sheet) => (
            <div key={sheet.index} className={`grid gap-3 lg:min-h-0 lg:flex-1 ${sheet.back ? "sm:grid-cols-2" : "grid-cols-1"}`}>
              <SheetSideSvg
                side={sheet.front}
                paper={layout.paper}
                project={project}
                mode={mode}
                title={
                  layout.sheets.length > 1
                    ? `Sheet ${sheet.index} of ${layout.sheets.length} — front`
                    : "Front (only side)"
                }
              />
              {sheet.back && (
                <SheetSideSvg
                  side={sheet.back}
                  paper={layout.paper}
                  project={project}
                  mode={mode}
                  title={`Sheet ${sheet.index} of ${layout.sheets.length} — back`}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
