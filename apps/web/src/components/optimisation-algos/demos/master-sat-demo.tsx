"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const vavs = [
  { id: "VAV-01", demand: 14 },
  { id: "VAV-02", demand: 9 },
  { id: "VAV-03", demand: 11 },
  { id: "VAV-04", demand: 18 },
];

export function MasterSatDemo() {
  const [mode, setMode] = useState<"high" | "blend">("high");

  const highSelect = Math.max(...vavs.map((v) => v.demand));
  const weighted = vavs.reduce((a, v) => a + v.demand, 0) / vavs.length;
  const satProxy = mode === "high" ? highSelect : weighted;
  const fanIndex = useMemo(() => Math.round(72 + (satProxy - 12) * 2.4), [satProxy]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setMode("high")}
          className={cn(
            "text-[11px] px-3 py-1.5 rounded-md border transition-all",
            mode === "high"
              ? "border-[rgba(108,178,255,0.45)] bg-[rgba(108,178,255,0.1)] text-[var(--info)]"
              : "border-white/[0.1] text-foreground-muted hover:text-foreground"
          )}
        >
          High select (cold SAT)
        </button>
        <button
          type="button"
          onClick={() => setMode("blend")}
          className={cn(
            "text-[11px] px-3 py-1.5 rounded-md border transition-all",
            mode === "blend"
              ? "border-[rgba(82,183,136,0.45)] bg-[rgba(82,183,136,0.1)] text-[var(--primary-bright)]"
              : "border-white/[0.1] text-foreground-muted hover:text-foreground"
          )}
        >
          Weighted average
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {vavs.map((v) => (
          <div key={v.id} className="rounded-md border border-white/[0.08] bg-black/20 p-2">
            <div className="text-[10px] text-foreground-faint">{v.id}</div>
            <div className="text-[12px] text-foreground font-medium">{v.demand} °C SAT demand</div>
            <div className="mt-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div className="h-full bg-[var(--info)]" style={{ width: `${(v.demand / 20) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-6 rounded-md border border-white/[0.08] bg-black/20 p-4">
        <div>
          <div className="text-[10px] text-foreground-faint uppercase tracking-wider">SAT proxy</div>
          <div className="text-2xl font-semibold text-foreground tabular-nums">{satProxy.toFixed(1)}</div>
          <div className="text-[10px] text-foreground-muted">°C equivalent</div>
        </div>
        <div>
          <div className="text-[10px] text-foreground-faint uppercase tracking-wider">Fan / coil stress</div>
          <div
            className={cn(
              "text-2xl font-semibold tabular-nums",
              mode === "blend" ? "text-[var(--primary-bright)]" : "text-[var(--warning)]"
            )}
          >
            {fanIndex}%
          </div>
          <div className="text-[10px] text-foreground-muted">illustrative index</div>
        </div>
      </div>
      <p className="text-[11px] text-foreground-muted leading-relaxed">
        High select chases the hottest cooling request and over-chills everyone else. A weighted blend eases SAT and
        reduces simultaneous reheat at perimeter zones.
      </p>
    </div>
  );
}
