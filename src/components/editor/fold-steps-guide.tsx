"use client";

import type { ZineFormat } from "@/lib/zine-layouts/types";

interface Step {
  title: string;
  description: string;
  diagram: React.ReactNode;
}

function Sheet({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 70" className="h-16 w-28">
      <rect x="4" y="4" width="112" height="62" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" />
      {children}
    </svg>
  );
}

const dash = { strokeDasharray: "4 3" };

const MINI_ZINE_STEPS: Step[] = [
  {
    title: "Print single-sided",
    description: "Print the \"Your zine\" export on one side of an A4 sheet, landscape orientation.",
    diagram: (
      <Sheet>
        <rect x="4" y="4" width="112" height="62" fill="var(--color-surface-muted)" />
      </Sheet>
    ),
  },
  {
    title: "Fold into quarters, then unfold",
    description: "Fold the sheet in half, then in half again the same way, to crease it into 4 equal columns — then unfold flat.",
    diagram: (
      <Sheet>
        <line x1="32" y1="4" x2="32" y2="66" stroke="#3355c9" strokeWidth="1.5" style={dash} />
        <line x1="60" y1="4" x2="60" y2="66" stroke="#3355c9" strokeWidth="1.5" style={dash} />
        <line x1="88" y1="4" x2="88" y2="66" stroke="#3355c9" strokeWidth="1.5" style={dash} />
      </Sheet>
    ),
  },
  {
    title: "Fold in half the other way — leave it folded",
    description: "Fold the sheet in half top-to-bottom (bringing the top edge down to the bottom edge). Don't unfold this one.",
    diagram: (
      <Sheet>
        <line x1="32" y1="4" x2="32" y2="66" stroke="var(--color-border)" strokeWidth="1" style={dash} />
        <line x1="60" y1="4" x2="60" y2="66" stroke="var(--color-border)" strokeWidth="1" style={dash} />
        <line x1="88" y1="4" x2="88" y2="66" stroke="var(--color-border)" strokeWidth="1" style={dash} />
        <line x1="4" y1="35" x2="116" y2="35" stroke="#3355c9" strokeWidth="1.5" style={dash} />
        <path d="M 60 20 L 60 30 M 55 26 L 60 30 L 65 26" fill="none" stroke="#3355c9" strokeWidth="1.5" />
      </Sheet>
    ),
  },
  {
    title: "Cut along the marked line",
    description: "With the sheet still folded from step 3, cut along the solid orange line on the fold/cut guide — only through the middle two columns.",
    diagram: (
      <Sheet>
        <line x1="32" y1="4" x2="32" y2="66" stroke="var(--color-border)" strokeWidth="1" style={dash} />
        <line x1="88" y1="4" x2="88" y2="66" stroke="var(--color-border)" strokeWidth="1" style={dash} />
        <line x1="32" y1="35" x2="88" y2="35" stroke="#c1440e" strokeWidth="2" />
        <text x="60" y="20" textAnchor="middle" fontSize="14" fill="#c1440e">
          ✂
        </text>
      </Sheet>
    ),
  },
  {
    title: "Unfold, then push the ends inward",
    description: "Unfold the sheet completely. Push the left and right ends toward the middle so the slit opens up and the sheet pops into an accordion/plus shape.",
    diagram: (
      <Sheet>
        <path d="M 30 35 L 45 35 M 40 30 L 45 35 L 40 40" fill="none" stroke="#3355c9" strokeWidth="1.5" />
        <path d="M 90 35 L 75 35 M 80 30 L 75 35 L 80 40" fill="none" stroke="#3355c9" strokeWidth="1.5" />
      </Sheet>
    ),
  },
  {
    title: "Fold flat into a booklet",
    description: "Fold the accordion flat into a stack with the front cover on top and the pages in order — that's your zine.",
    diagram: (
      <svg viewBox="0 0 120 70" className="h-16 w-28">
        <rect x="40" y="10" width="40" height="52" fill="var(--color-surface-muted)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        <rect x="43" y="13" width="40" height="52" fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <rect x="37" y="7" width="40" height="52" fill="none" stroke="var(--color-border)" strokeWidth="1" />
      </svg>
    ),
  },
];

const SADDLE_STITCH_STEPS: Step[] = [
  {
    title: "Print each sheet double-sided",
    description: "Print every sheet from \"Your zine\" double-sided (front and back on the same A4 sheet), one sheet at a time.",
    diagram: (
      <svg viewBox="0 0 120 70" className="h-16 w-28">
        <rect x="10" y="6" width="45" height="58" fill="var(--color-surface-muted)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        <text x="32" y="38" textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">front</text>
        <rect x="65" y="6" width="45" height="58" fill="var(--color-surface-muted)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        <text x="87" y="38" textAnchor="middle" fontSize="10" fill="var(--color-text-muted)">back</text>
      </svg>
    ),
  },
  {
    title: "Fold each sheet in half",
    description: "Fold every printed sheet in half along the vertical centre line, front side out.",
    diagram: (
      <Sheet>
        <line x1="60" y1="4" x2="60" y2="66" stroke="#3355c9" strokeWidth="1.5" style={dash} />
        <path d="M 44 20 L 44 30 M 39 26 L 44 30 L 49 26" fill="none" stroke="#3355c9" strokeWidth="1.5" />
        <path d="M 76 20 L 76 30 M 71 26 L 76 30 L 81 26" fill="none" stroke="#3355c9" strokeWidth="1.5" />
      </Sheet>
    ),
  },
  {
    title: "Nest the sheets in order",
    description: "Slot the folded sheets inside one another — sheet 1 (the outer cover) on the outside, sheet 2 inside it, and so on toward the centre.",
    diagram: (
      <svg viewBox="0 0 120 70" className="h-16 w-28">
        <rect x="30" y="6" width="60" height="58" fill="var(--color-surface-muted)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        <rect x="36" y="10" width="48" height="50" fill="none" stroke="var(--color-border)" strokeWidth="1" />
        <rect x="42" y="14" width="36" height="42" fill="none" stroke="var(--color-border)" strokeWidth="1" />
      </svg>
    ),
  },
  {
    title: "Staple along the spine",
    description: "With everything nested and folded, staple (or sew) along the centre fold to bind the booklet.",
    diagram: (
      <svg viewBox="0 0 120 70" className="h-16 w-28">
        <rect x="30" y="6" width="60" height="58" fill="var(--color-surface-muted)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        <line x1="60" y1="6" x2="60" y2="64" stroke="#3355c9" strokeWidth="1.5" style={dash} />
        <rect x="57" y="14" width="6" height="3" fill="#57554e" />
        <rect x="57" y="53" width="6" height="3" fill="#57554e" />
      </svg>
    ),
  },
];

export function FoldStepsGuide({ format }: { format: ZineFormat }) {
  const steps = format === "mini-zine-8" ? MINI_ZINE_STEPS : SADDLE_STITCH_STEPS;

  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {steps.map((step, i) => (
        <li key={step.title} className="flex flex-col items-center gap-1.5 rounded-lg border border-[var(--color-border)] p-2 text-center">
          <span className="text-[10px] font-medium text-[var(--color-text-muted)]">Step {i + 1}</span>
          {step.diagram}
          <p className="text-[11px] font-medium text-[var(--color-text)]">{step.title}</p>
          <p className="text-[10px] leading-snug text-[var(--color-text-muted)]">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
