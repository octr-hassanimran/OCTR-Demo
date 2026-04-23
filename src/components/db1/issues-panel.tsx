"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";

const issues = [
  {
    title: "Chiller-02 short cycling",
    severity: "High",
    impact: "-2.1 MWh / week",
    status: "Investigating",
  },
  {
    title: "Boiler-01 draft fluctuation",
    severity: "Medium",
    impact: "-0.7 MWh / week",
    status: "Tuning",
  },
  {
    title: "AHU-03 filter delta-P rising",
    severity: "Low",
    impact: "-0.3 MWh / week",
    status: "Planned",
  },
];

export function IssuesPanel() {
  return (
    <div className="space-y-3 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Active Issues</h3>
          <p className="text-[11px] text-[var(--text-faint)]">Prioritized by savings impact</p>
        </div>
        <span className="text-[10px] px-2 py-1 rounded-full bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)] border border-[rgba(82,183,136,0.25)]">
          Live
        </span>
      </div>

      <div className="space-y-3">
        {issues.map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)] flex items-start justify-between gap-2"
          >
            <div>
              <div className="flex items-center gap-2">
                {idx === 0 ? (
                  <AlertTriangle className="w-4 h-4 text-[var(--danger)]" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-[var(--warning)]" />
                )}
                <div className="text-[13px] font-semibold text-[var(--text)]">{item.title}</div>
              </div>
              <div className="text-[11px] text-[var(--text-faint)] mt-1">Impact: {item.impact}</div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">{item.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
