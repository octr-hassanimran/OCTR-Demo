"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ChillerStagingDemo() {
  const [loadPct, setLoadPct] = useState(42);
  const [logic, setLogic] = useState<"return" | "load">("return");

  const secondOnReturn = loadPct > 38;
  const secondOnLoad = loadPct > 58;
  const secondRunning = logic === "return" ? secondOnReturn : secondOnLoad;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLogic("return")}
          className={cn(
            "text-[11px] px-3 py-1.5 rounded-md border transition-all",
            logic === "return"
              ? "border-[rgba(246,195,68,0.45)] bg-[rgba(246,195,68,0.08)] text-[var(--warning)]"
              : "border-white/[0.1] text-foreground-muted hover:text-foreground"
          )}
        >
          Stage on return temp
        </button>
        <button
          type="button"
          onClick={() => setLogic("load")}
          className={cn(
            "text-[11px] px-3 py-1.5 rounded-md border transition-all",
            logic === "load"
              ? "border-[rgba(82,183,136,0.45)] bg-[rgba(82,183,136,0.1)] text-[var(--primary-bright)]"
              : "border-white/[0.1] text-foreground-muted hover:text-foreground"
          )}
        >
          Stage on load + kW
        </button>
      </div>

      <label className="block text-[11px] text-foreground-muted">
        Plant load (% of design block)
        <input
          type="range"
          min={20}
          max={85}
          value={loadPct}
          onChange={(e) => setLoadPct(Number(e.target.value))}
          className="w-full mt-1 accent-[var(--primary-bright)]"
        />
        <span className="text-foreground font-medium tabular-nums">{loadPct}%</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div
          className={cn(
            "rounded-md border p-3 transition-colors",
            "border-white/[0.1] bg-black/20"
          )}
        >
          <div className="text-[10px] text-foreground-faint">CHP-1-1</div>
          <div className="text-[13px] font-semibold text-[var(--primary-bright)] mt-1">Running</div>
        </div>
        <div
          className={cn(
            "rounded-md border p-3 transition-colors",
            secondRunning
              ? "border-[rgba(229,115,115,0.35)] bg-[rgba(229,115,115,0.08)]"
              : "border-[rgba(82,183,136,0.35)] bg-[rgba(82,183,136,0.06)]"
          )}
        >
          <div className="text-[10px] text-foreground-faint">CHP-1-2</div>
          <div className={cn("text-[13px] font-semibold mt-1", secondRunning ? "text-[var(--danger)]" : "text-[var(--primary-bright)]")}>
            {secondRunning ? "Started (early?)" : "Held off"}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-foreground-muted leading-relaxed">
        Return-temperature-only logic is a blunt trigger and can spin up CHP-1-2 before true block load needs it.
        Gating on kW / ton + load predicts the second absorption machine more faithfully.
      </p>
    </div>
  );
}
