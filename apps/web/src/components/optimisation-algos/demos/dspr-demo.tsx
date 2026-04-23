"use client";

import { useMemo, useState } from "react";

export function DsprDemo() {
  const [pressureTrimPct, setPressureTrimPct] = useState(18);
  const mostOpenVav = useMemo(() => Math.max(72, 96 - pressureTrimPct * 0.85), [pressureTrimPct]);
  const fanSavings = Math.round(11000 * (1 - Math.pow(1 - pressureTrimPct / 100, 3)));

  const onTarget = mostOpenVav >= 90 && mostOpenVav <= 95;

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-5">
      <div className="rounded-md border border-white/[0.08] bg-black/20 p-4">
        <svg viewBox="0 0 400 140" className="w-full h-auto">
          <rect x="20" y="50" width="360" height="36" rx="8" fill="rgba(108,178,255,0.08)" stroke="rgba(108,178,255,0.35)" />
          <text x="200" y="42" textAnchor="middle" className="fill-[var(--text-muted)] text-[10px]">
            Main supply duct
          </text>
          <rect x="300" y="32" width="56" height="72" rx="6" fill="rgba(17,27,22,0.9)" stroke="rgba(82,183,136,0.4)" />
          <text x="328" y="58" textAnchor="middle" className="fill-[var(--text-muted)] text-[8px]">
            VAV
          </text>
          <rect
            x="308"
            y="88"
            width="40"
            height={Math.min(44, (mostOpenVav / 100) * 44)}
            rx="4"
            fill="rgba(82,183,136,0.45)"
          />
          <text x="328" y="122" textAnchor="middle" className="fill-[var(--primary-bright)] text-[9px] font-medium">
            {mostOpenVav.toFixed(0)}%
          </text>
          <text x="200" y="118" textAnchor="middle" className="fill-[var(--text-faint)] text-[9px]">
            Target band 90–95% open
          </text>
        </svg>
      </div>
      <div className="space-y-3">
        <label className="block text-[11px] text-foreground-muted">
          Static pressure reset (trim)
          <input
            type="range"
            min={5}
            max={35}
            value={pressureTrimPct}
            onChange={(e) => setPressureTrimPct(Number(e.target.value))}
            className="w-full mt-1 accent-[var(--primary-bright)]"
          />
          <span className="text-foreground tabular-nums">{pressureTrimPct}%</span>
        </label>
        <div
          className={`rounded-md border px-2 py-2 text-[11px] ${
            onTarget
              ? "border-[rgba(82,183,136,0.35)] text-[var(--primary-bright)] bg-[rgba(82,183,136,0.06)]"
              : "border-[rgba(246,195,68,0.35)] text-[var(--warning)] bg-[rgba(246,195,68,0.06)]"
          }`}
        >
          {onTarget ? "Most-open damper in band — good reset" : "Adjust setpoint until VAV lands near 92%"}
        </div>
        <p className="text-[11px] text-foreground-muted leading-relaxed">
          Fan affinity (cube law): illustrative{" "}
          <span className="text-[var(--primary-bright)] font-semibold tabular-nums">~{fanSavings.toLocaleString()} kWh</span>{" "}
          class savings at this trim level.
        </p>
      </div>
    </div>
  );
}
