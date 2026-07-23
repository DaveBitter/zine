import { ShieldCheck } from "lucide-react";

export function PrivacyNotice() {
  return (
    <p className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-2 text-xs text-[var(--color-text-muted)]">
      <ShieldCheck size={15} className="shrink-0" />
      Your photos stay on your device. Nothing is uploaded or processed remotely — everything
      happens right here in your browser.
    </p>
  );
}
