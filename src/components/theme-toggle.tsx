"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const STORAGE_KEY = "zine-theme";

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setTheme(stored === "light" || stored === "dark" ? stored : getSystemTheme());
  }, []);

  const apply = (next: Theme) => {
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.dataset.theme = next;
  };

  if (!theme) return <div className="h-7 w-7" aria-hidden />;

  return (
    <button
      type="button"
      onClick={() => apply(theme === "dark" ? "light" : "dark")}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)]"
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
