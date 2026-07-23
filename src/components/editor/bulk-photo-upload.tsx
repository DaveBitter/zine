"use client";

import { useRef, useState } from "react";
import { Images } from "lucide-react";
import { useZineProject } from "@/hooks/zine-project-context";

/**
 * Select several photos at once and drop them into empty slots in page
 * order (page 1's first empty slot, then its next slot, then page 2, ...).
 * Existing photos are never overwritten — only empty slots get filled.
 */
export function BulkPhotoUpload() {
  const { addPhotosInOrder } = useZineProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setBusy(true);
    setMessage(null);
    try {
      const { added, skipped } = await addPhotosInOrder(Array.from(fileList));
      setMessage(
        skipped > 0
          ? `Added ${added} photo${added === 1 ? "" : "s"} — ${skipped} didn't fit (no empty slots left).`
          : `Added ${added} photo${added === 1 ? "" : "s"}.`,
      );
    } finally {
      setBusy(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        title="Add several photos at once — they'll fill empty slots in page order. Drag a page onto another to swap them after."
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--color-accent)] px-3 py-2 text-sm font-medium text-[var(--color-accent-contrast)] transition hover:opacity-90 disabled:opacity-60"
      >
        <Images size={16} />
        {busy ? "Adding…" : "Add multiple photos"}
      </button>
      {message && <p className="text-[11px] text-[var(--color-text-muted)]">{message}</p>}
    </div>
  );
}
