"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function DeadBandDemo() {
  const [bandC, setBandC] = useState(1.2);

  const overlap = useMemo(() => Math.max(0, 2.2 - bandC * 2), [bandC]);

  return (
    <div className="space-y-4">
      <div className="relative h-36 rounded-md border border-white/[0.08] bg-black/25 overflow-hidden">
        <div className="absolute inset-x-4 top-4 text-[10px] text-foreground-faint">Cooling call (upper)</div>
        <div className="absolute inset-x-4 bottom-4 text-[10px] text-foreground-faint">Heating call (lower)</div>
        <div
          className="absolute left-[18%] right-[18%] top-[22%] h-[28%] rounded-md bg-[rgba(108,178,255,0.2)] border border-[rgba(108,178,255,0.45)]"
          style={{ transform: `translateY(${-bandC * 8}px)` }}
        />
        <div
          className="absolute left-[18%] right-[18%] bottom-[22%] h-[28%] rounded-md bg-[rgba(229,115,115,0.18)] border border-[rgba(229,115,115,0.45)]"
          style={{ transform: `translateY(${bandC * 8}px)` }}
        />
        <div
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-medium border transition-colors",
            overlap > 0.3
              ? "bg-[rgba(246,195,68,0.15)] text-[var(--warning)] border-[rgba(246,195,68,0.35)]"
              : "bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)] border-[rgba(82,183,136,0.35)]"
          )}
        >
          {overlap > 0.3 ? "H+C overlap risk" : "Comfort buffer"}
        </div>
      </div>
      <label className="block text-[11px] text-foreground-muted">
        Dead band width (°C)
        <input
          type="range"
          min={0.4}
          max={3.5}
          step={0.1}
          value={bandC}
          onChange={(e) => setBandC(Number(e.target.value))}
          className="w-full mt-1 accent-[var(--primary-bright)]"
        />
        <span className="text-foreground tabular-nums">{bandC.toFixed(1)} °C</span>
      </label>
      <p className="text-[11px] text-foreground-muted leading-relaxed">
        Wider bands create a neutral gap so heating and cooling do not hunt the same space. Service hot water loops (e.g.{" "}
        <span className="text-foreground">45–50 °C</span> pump bands) use the same idea on the water side.
      </p>
    </div>
  );
}
