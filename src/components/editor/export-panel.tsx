"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useZineProject } from "@/hooks/zine-project-context";
import { exportPdf } from "@/lib/export/exportPdf";
import { exportPng } from "@/lib/export/exportPng";
import type { RenderMode } from "@/lib/export/renderSheetToCanvas";

type Job = `${RenderMode}-${"pdf" | "png"}`;

export function ExportPanel() {
  const { project } = useZineProject();
  const [running, setRunning] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!project) return null;

  const run = async (mode: RenderMode, format: "pdf" | "png") => {
    setError(null);
    setRunning(`${mode}-${format}`);
    try {
      if (format === "pdf") {
        await exportPdf(project, mode);
      } else {
        await exportPng(project, mode);
      }
    } catch {
      setError("Export failed — try again, or reduce photo file sizes.");
    } finally {
      setRunning(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-[var(--color-text)]">Your zine</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Photos only, print-ready, no lines on top of your images.
        </p>
        <div className="flex gap-2">
          <ExportButton label="Export PDF" busy={running === "content-pdf"} disabled={running !== null} onClick={() => run("content", "pdf")} primary />
          <ExportButton label="Export PNG" busy={running === "content-png"} disabled={running !== null} onClick={() => run("content", "png")} />
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-[var(--color-border)] pt-4">
        <p className="text-sm font-medium text-[var(--color-text)]">Template</p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Blank sheet with page numbers and the fold/cut lines — print this once to work out the
          assembly, no photos.
        </p>
        <div className="flex gap-2">
          <ExportButton label="Export PDF" busy={running === "guide-pdf"} disabled={running !== null} onClick={() => run("guide", "pdf")} />
          <ExportButton label="Export PNG" busy={running === "guide-png"} disabled={running !== null} onClick={() => run("guide", "png")} />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

function ExportButton({
  label,
  busy,
  disabled,
  onClick,
  primary,
}: {
  label: string;
  busy: boolean;
  disabled: boolean;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={
        primary
          ? "flex items-center gap-1.5 rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-accent-contrast)] disabled:opacity-60"
          : "flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] disabled:opacity-60"
      }
    >
      {busy ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
      {busy ? "Preparing…" : label}
    </button>
  );
}
