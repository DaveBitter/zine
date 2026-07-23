"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { ZineProjectProvider, useZineProject } from "@/hooks/zine-project-context";
import { FormatPicker } from "@/components/editor/format-picker";
import { PageThumbnailList } from "@/components/editor/page-thumbnail-list";
import { BulkPhotoUpload } from "@/components/editor/bulk-photo-upload";
import { PageCanvasEditor } from "@/components/editor/page-canvas-editor";
import { SheetPreview } from "@/components/editor/sheet-preview";
import { PrivacyNotice } from "@/components/editor/privacy-notice";
import { ExportPanel } from "@/components/editor/export-panel";
import { ThemeToggle } from "@/components/theme-toggle";

function EditorShell() {
  const { project, resetProject } = useZineProject();
  const [activePage, setActivePage] = useState(1);

  if (!project) return <FormatPicker />;

  return (
    <div className="mx-auto flex min-h-dvh max-w-7xl flex-col gap-4 px-4 py-4 lg:h-dvh lg:gap-2 lg:overflow-hidden lg:py-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-base font-semibold text-[var(--color-text)]">Editing your zine</h1>
        <div className="flex flex-wrap items-center gap-3">
          <PrivacyNotice />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => {
              if (confirm("Start over? This discards the current zine.")) resetProject();
            }}
            className="flex shrink-0 items-center gap-1 text-xs text-[var(--color-text-muted)] underline"
          >
            <RotateCcw size={12} />
            Start over
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-[180px_260px_1fr] lg:gap-4">
        <section className="flex flex-col gap-1.5 lg:min-h-0 lg:self-start">
          <h2 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Pages</h2>
          <BulkPhotoUpload />
          <PageThumbnailList activePage={activePage} onSelect={setActivePage} />
        </section>

        <section className="flex flex-col gap-1.5 lg:min-h-0 lg:self-start">
          <h2 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Edit page</h2>
          <PageCanvasEditor logicalPage={activePage} />
        </section>

        <section className="flex flex-col gap-2 lg:min-h-0">
          <div className="flex flex-col gap-1.5 lg:min-h-0 lg:flex-1">
            <h2 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">
              Sheet preview
            </h2>
            <div className="lg:min-h-0 lg:flex-1">
              <SheetPreview project={project} />
            </div>
          </div>
          <div className="shrink-0">
            <h2 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide">Export</h2>
            <ExportPanel />
          </div>
        </section>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <ZineProjectProvider>
      <EditorShell />
    </ZineProjectProvider>
  );
}
