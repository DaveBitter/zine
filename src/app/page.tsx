import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center gap-6 px-4 py-16">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>
      <div>
        <p className="text-sm font-medium tracking-wide text-[var(--color-accent)] uppercase">Zine</p>
        <h1 className="mt-2 text-3xl font-semibold text-[var(--color-text)] sm:text-4xl">
          Lay out a printable photo zine, right in your browser.
        </h1>
        <p className="mt-4 text-[var(--color-text-muted)]">
          Drop your trip or event photos onto each page, position and crop them, then export a
          print-ready sheet with fold and cut lines already worked out for you — the classic
          one-sheet mini zine, or a longer saddle-stitch booklet.
        </p>
      </div>

      <ul className="flex flex-col gap-2 text-sm text-[var(--color-text-muted)]">
        <li>— Your photos never leave your device. Nothing is uploaded.</li>
        <li>— Export a print-ready PDF or PNG, guides included.</li>
        <li>— A4 sheets, 8-page mini zine or multi-sheet booklets.</li>
      </ul>

      <Link
        href="/editor"
        className="w-fit rounded-lg bg-[var(--color-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-accent-contrast)] transition hover:opacity-90"
      >
        Start a new zine
      </Link>
    </main>
  );
}
