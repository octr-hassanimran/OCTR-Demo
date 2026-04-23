"use client";

import { useMemo, useState } from "react";

export function OssTimelineDemo() {
  const [fixedStartH, setFixedStartH] = useState(4);
  const [optimalStartH, setOptimalStartH] = useState(2.2);

  const savedH = Math.max(0, fixedStartH - optimalStartH);
  const inertiaPct = useMemo(() => Math.min(100, 40 + (4 - optimalStartH) * 18), [optimalStartH]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-5">
      <div>
        <div className="relative h-24 rounded-md border border-white/[0.08] bg-black/25 px-3 pt-6">
          <div className="absolute left-3 right-3 top-2 flex justify-between text-[9px] text-foreground-faint uppercase tracking-wider">
            <span>Pre-occupancy</span>
            <span>Occupancy</span>
          </div>
          <div className="absolute left-[12%] right-[8%] top-12 h-2 rounded-full bg-white/[0.06]" />
          <div
            className="absolute left-[12%] top-12 h-2 rounded-l-full bg-[rgba(108,178,255,0.35)]"
            style={{ width: `${Math.min(88, (fixedStartH / 6) * 88)}%` }}
            title="Fixed schedule runway"
          />
          <div
            className="absolute left-[12%] top-12 h-2 rounded-l-full bg-[rgba(82,183,136,0.65)]"
            style={{ width: `${Math.min(88, (optimalStartH / 6) * 88)}%` }}
          />
          <div className="absolute left-[12%] top-[52px] text-[10px] text-[var(--info)]">Fixed start</div>
          <div className="absolute left-[12%] top-[66px] text-[10px] text-[var(--primary-bright)]">Optimised start</div>
        </div>
        <div className="mt-3 space-y-3">
          <label className="block text-[11px] text-foreground-muted">
            Fixed schedule start (h before open)
            <input
              type="range"
              min={1.5}
              max={5.5}
              step={0.1}
              value={fixedStartH}
              onChange={(e) => setFixedStartH(Number(e.target.value))}
              className="w-full mt-1 accent-[var(--info)]"
            />
            <span className="text-foreground tabular-nums">{fixedStartH.toFixed(1)} h</span>
          </label>
          <label className="block text-[11px] text-foreground-muted">
            Optimised start (thermal model)
            <input
              type="range"
              min={0.5}
              max={4.5}
              step={0.1}
              value={optimalStartH}
              onChange={(e) => setOptimalStartH(Number(e.target.value))}
              className="w-full mt-1 accent-[var(--primary-bright)]"
            />
            <span className="text-foreground tabular-nums">{optimalStartH.toFixed(1)} h</span>
          </label>
        </div>
      </div>
      <div className="rounded-md border border-white/[0.08] bg-black/20 p-3 space-y-2">
        <div className="text-[11px] text-foreground-faint uppercase tracking-widest">Thermal headroom</div>
        <div className="h-28 rounded-md border border-white/[0.06] overflow-hidden flex flex-col justify-end p-2">
          <div
            className="w-full rounded-sm bg-gradient-to-t from-[#1b4332] to-[var(--primary-bright)] opacity-90 transition-all duration-300"
            style={{ height: `${inertiaPct}%` }}
          />
        </div>
        <p className="text-[11px] text-foreground-muted leading-relaxed">
          Estimated pre-run savings:{" "}
          <span className="text-[var(--primary-bright)] font-semibold tabular-nums">{savedH.toFixed(1)} h</span> less plant
          time per day when the model finds the latest feasible start for AHUs.
        </p>
      </div>
    </div>
  );
}
