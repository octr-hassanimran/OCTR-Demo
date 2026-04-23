"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SchematicCanvasShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/[0.1]",
        "bg-[linear-gradient(165deg,rgba(17,27,22,0.92)_0%,rgba(8,12,16,0.96)_50%,rgba(12,18,14,0.94)_100%)]",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_50px_rgba(0,0,0,0.45)]",
        "before:pointer-events-none before:absolute before:inset-0 before:opacity-[0.07]",
        "before:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]",
        "before:bg-[length:24px_24px]",
        className
      )}
    >
      {/* Corner brackets */}
      <div className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2 border-[rgba(101,212,161,0.35)]" />
      <div className="pointer-events-none absolute right-2 top-2 h-4 w-4 border-r-2 border-t-2 border-[rgba(101,212,161,0.35)]" />
      <div className="pointer-events-none absolute bottom-2 left-2 h-4 w-4 border-b-2 border-l-2 border-[rgba(101,212,161,0.25)]" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-4 w-4 border-b-2 border-r-2 border-[rgba(101,212,161,0.25)]" />
      {children}
    </div>
  );
}

const legendItems = [
  { label: "CHW / CW supply", color: "#6cb2ff" },
  { label: "Return / heating", color: "#e57373" },
  { label: "Optimisation focus", color: "#65d4a1" },
] as const;

export function SchematicLegend({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-white/[0.06] px-4 py-2.5 bg-black/20",
        className
      )}
    >
      <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-foreground-faint">Legend</span>
      {legendItems.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="h-2 w-5 rounded-sm shadow-[0_0_8px_currentColor]" style={{ backgroundColor: item.color, color: item.color }} />
          <span className="text-[10px] font-mono text-foreground-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
