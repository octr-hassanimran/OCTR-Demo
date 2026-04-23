"use client";

import { ddcStatuses } from "@/data/operations";
import { formatRelativeTime } from "@/lib/utils";

const statusConfig = {
  live: {
    border: "border-l-[#52b788]",
    dot: "bg-[#52b788]",
    text: "text-[#52b788]",
    label: "Live",
  },
  stale: {
    border: "border-l-[#f6c344]",
    dot: "bg-[#f6c344]",
    text: "text-[#f6c344]",
    label: "Stale",
  },
  offline: {
    border: "border-l-[#e57373]",
    dot: "bg-[#e57373]",
    text: "text-[#e57373]",
    label: "Offline",
  },
};

export function DDCStatusRibbon() {
  return (
    <div className="relative">
      <div className="flex gap-3 overflow-x-auto pb-2 pr-12">
        {ddcStatuses.map((ddc) => {
          const cfg = statusConfig[ddc.status];
          return (
            <button
              key={ddc.id}
              className={`
                flex-shrink-0 w-[172px] p-3.5 rounded-md text-left
                border-l-[3px] ${cfg.border}
                bg-[var(--surface)]
                shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)]
                cursor-pointer
                transition-all duration-200 ease-[var(--ease-standard)]
                hover:shadow-[0_0_0_1px_rgba(82,183,136,0.35),0_8px_32px_rgba(64,145,108,0.2)]
                hover:-translate-y-px
              `}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold tracking-wide text-[var(--text-faint)] uppercase">
                  {ddc.id}
                </span>
                <span
                  className={`flex items-center gap-1 text-[10px] font-semibold ${cfg.text}`}
                >
                  <span
                    className={`w-[6px] h-[6px] rounded-full ${cfg.dot} ${
                      ddc.status === "live" ? "animate-pulse" : ""
                    }`}
                  />
                  {cfg.label}
                </span>
              </div>

              <div className="text-[13px] font-medium text-[var(--text)] mb-1 truncate">
                {ddc.name}
              </div>

              <div className="text-[11px] text-[var(--text-muted)] mb-2">
                {formatRelativeTime(ddc.lastSeen)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-faint)]">
                  {ddc.pointCount} pts
                </span>
                {ddc.activeAlarms > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-[var(--danger)] text-white">
                    {ddc.activeAlarms}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-[var(--bg)] to-transparent pointer-events-none" />
    </div>
  );
}
