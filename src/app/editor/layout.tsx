"use client";

import { ZineProjectProvider } from "@/hooks/zine-project-context";

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <ZineProjectProvider>{children}</ZineProjectProvider>;
}
