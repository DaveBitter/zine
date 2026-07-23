"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Layers } from "lucide-react";
import { useZineProject } from "@/hooks/zine-project-context";
import { ZineFormat } from "@/lib/zine-layouts/types";
import { ThemeToggle } from "@/components/theme-toggle";

const SADDLE_STITCH_PAGE_OPTIONS = [8, 12, 16, 20, 24, 28, 32];

export function FormatPicker() {
  const { project, createProject } = useZineProject();
  const router = useRouter();
  const [format, setFormat] = useState<ZineFormat>("mini-zine-8");
  const [pageCount, setPageCount] = useState(16);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-16">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-[var(--color-text)]">Start a new zine</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Pick a format. You can place your own photos on every page next.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setFormat("mini-zine-8")}
          className={`rounded-xl border p-4 text-left transition ${
            format === "mini-zine-8"
              ? "border-[var(--color-accent)] bg-[var(--color-surface)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)]/60"
          }`}
        >
          <BookOpen size={18} className="text-[var(--color-accent)]" />
          <div className="mt-2 font-medium text-[var(--color-text)]">Mini zine (8 pages)</div>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            One A4 sheet, one cut, no staples. The classic pocket zine.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setFormat("saddle-stitch")}
          className={`rounded-xl border p-4 text-left transition ${
            format === "saddle-stitch"
              ? "border-[var(--color-accent)] bg-[var(--color-surface)]"
              : "border-[var(--color-border)] bg-[var(--color-surface)]/60"
          }`}
        >
          <Layers size={18} className="text-[var(--color-accent)]" />
          <div className="mt-2 font-medium text-[var(--color-text)]">Saddle-stitch booklet</div>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Multiple A4 sheets, folded and stapled together. For longer zines.
          </p>
        </button>
      </div>

      {format === "saddle-stitch" && (
        <div className="flex items-center gap-3">
          <label htmlFor="page-count" className="text-sm text-[var(--color-text-muted)]">
            Page count
          </label>
          <select
            id="page-count"
            value={pageCount}
            onChange={(e) => setPageCount(Number(e.target.value))}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm text-[var(--color-text)]"
          >
            {SADDLE_STITCH_PAGE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} pages ({n / 4} sheets)
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={() => {
          if (project && !confirm("Starting a new zine discards the one you're currently editing. Continue?")) {
            return;
          }
          createProject(format, format === "mini-zine-8" ? 8 : pageCount);
          router.push("/editor/design");
        }}
        className="w-fit rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-contrast)] transition hover:opacity-90"
      >
        Start designing
      </button>
    </div>
  );
}
