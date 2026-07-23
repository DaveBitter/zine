"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { useZineProject } from "@/hooks/zine-project-context";
import { PageThumbnailList } from "@/components/editor/page-thumbnail-list";
import { BulkPhotoUpload } from "@/components/editor/bulk-photo-upload";
import { PageCanvasEditor } from "@/components/editor/page-canvas-editor";
import { SheetPreview } from "@/components/editor/sheet-preview";
import { PrivacyNotice } from "@/components/editor/privacy-notice";
import { ExportPanel } from "@/components/editor/export-panel";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DesignPage() {
  const { project, resetProject } = useZineProject();
  const router = useRouter();
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    // No in-memory project (fresh load, refresh, or direct link) — there's
    // nothing to design yet, so send them to pick a format first.
    if (!project) router.replace("/editor");
  }, [project, router]);

  if (!project) return null;

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
              if (confirm("Start over? This discards the current zine.")) {
                resetProject();
                router.push("/editor");
              }
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
