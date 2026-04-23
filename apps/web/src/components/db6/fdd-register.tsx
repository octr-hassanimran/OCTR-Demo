"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  fddFaults,
  fddRules,
  faultPriorityPoints,
  faultResolutionHistogram,
  faultSavingsBars,
  faultAgeBuckets,
  type FDDFault,
} from "@/data/db6";
import { AlertCircle, AlertTriangle, Info, X, Clock } from "lucide-react";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[360px] rounded-md bg-[var(--surface)] animate-pulse" />
  ),
});

const severityConfig = {
  high: { icon: AlertCircle, color: "text-[#e57373]", border: "border-l-[#e57373]", label: "High" },
  med: { icon: AlertTriangle, color: "text-[#f6c344]", border: "border-l-[#f6c344]", label: "Med" },
  low: { icon: Info, color: "text-[#6cb2ff]", border: "border-l-[#6cb2ff]", label: "Low" },
};

const statusStyles = {
  open: "text-[#e57373] bg-[rgba(229,115,115,0.12)]",
  ack: "text-[#f6c344] bg-[rgba(246,195,68,0.12)]",
  closed: "text-[#52b788] bg-[rgba(82,183,136,0.12)]",
};

export function FDDRegister() {
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "med" | "low">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "ack" | "closed">("all");
  const [oppFilter, setOppFilter] = useState<"all" | number>("all");
  const [equipmentFilter, setEquipmentFilter] = useState("");
  const [selectedFault, setSelectedFault] = useState<FDDFault | null>(null);

  const filteredFaults = useMemo(() => {
    return fddFaults.filter((f) => {
      if (severityFilter !== "all" && f.severity !== severityFilter) return false;
      if (statusFilter !== "all" && f.status !== statusFilter) return false;
      if (oppFilter !== "all" && f.oehOpp !== oppFilter) return false;
      if (
        equipmentFilter &&
        !f.equipment.toLowerCase().includes(equipmentFilter.toLowerCase())
      )
        return false;
      return true;
    });
  }, [severityFilter, statusFilter, oppFilter, equipmentFilter]);

  const priorityOption = useMemo(() => {
    const data = faultPriorityPoints.map((p) => ({
      value: [p.daysActive, p.severityScore, p.kwhPerDayWaste, p.faultType, p.faultId],
      name: p.faultType,
      itemStyle: {
        color:
          p.severity === "high"
            ? "#e57373"
            : p.severity === "med"
            ? "#f6c344"
            : "#52b788",
      },
    }));

    return {
      backgroundColor: "transparent",
      grid: { left: 50, right: 20, bottom: 55, top: 30 },
      tooltip: {
        trigger: "item",
        formatter: (params: { value: number[] }) => {
          const [days, severity, waste, type] = params.value;
          return `
            <div style="min-width:180px">
              <div style="font-weight:600;margin-bottom:4px">${type}</div>
              <div style="color:#A7C4B5;font-size:12px">
                Days active: ${days}<br/>
                Severity score: ${severity}<br/>
                Waste: ~${waste} kWh/day
              </div>
            </div>
          `;
        },
      },
      xAxis: {
        name: "Days Active",
        nameTextStyle: { color: "#A7C4B5", fontSize: 11 },
        axisLabel: { color: "#A7C4B5" },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },
      yAxis: {
        name: "Severity Score",
        nameTextStyle: { color: "#A7C4B5", fontSize: 11 },
        axisLabel: { color: "#A7C4B5" },
        axisLine: { show: false },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },
      visualMap: [
        {
          show: false,
          type: "piecewise",
          pieces: [
            { min: 0, max: 50, color: "#52b788" },
            { min: 50, max: 75, color: "#f6c344" },
            { min: 75, color: "#e57373" },
          ],
          dimension: 1,
        },
      ],
      series: [
        {
          type: "scatter",
          data,
          symbolSize: (val: number[]) => Math.min(90, 12 + (val[2] ?? 0) / 6),
          emphasis: { focus: "series", scale: true },
          itemStyle: { shadowBlur: 12, shadowColor: "rgba(0,0,0,0.35)" },
          markArea: {
            silent: true,
            itemStyle: { opacity: 0.07 },
            data: [
              [{ xAxis: 0, yAxis: 0 }, { xAxis: 4, yAxis: 50, itemStyle: { color: "#52b788" }, label: { formatter: "Monitor", color: "#52b788" } }],
              [{ xAxis: 4, yAxis: 0 }, { xAxis: 8, yAxis: 50, itemStyle: { color: "#f6c344" }, label: { formatter: "Watch", color: "#f6c344" } }],
              [{ xAxis: 0, yAxis: 50 }, { xAxis: 4, yAxis: 100, itemStyle: { color: "#f6c344" }, label: { formatter: "Fix soon", color: "#f6c344" } }],
              [{ xAxis: 4, yAxis: 50 }, { xAxis: 20, yAxis: 100, itemStyle: { color: "#e57373" }, label: { formatter: "Fix today", color: "#e57373" } }],
            ],
          },
        },
      ],
    };
  }, []);

  const resolutionHistogramOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 40, right: 10, top: 20, bottom: 35 },
      xAxis: {
        type: "category",
        data: faultResolutionHistogram.map((d) => d.bucket),
        axisLabel: { color: "#A7C4B5" },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#A7C4B5" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },
      series: [
        {
          type: "bar",
          data: faultResolutionHistogram.map((d) => d.count),
          itemStyle: { color: "#52b788" },
          barWidth: 22,
        },
      ],
      tooltip: { trigger: "axis" },
    }),
    []
  );

  const savingsBarOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 140, right: 10, top: 10, bottom: 35 },
      xAxis: {
        type: "value",
        axisLabel: { color: "#A7C4B5" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },
      yAxis: {
        type: "category",
        data: faultSavingsBars.map((d) => d.faultType),
        axisLabel: { color: "#A7C4B5", fontSize: 11 },
        axisLine: { show: false },
      },
      series: [
        {
          type: "bar",
          data: faultSavingsBars.map((d) => d.savedKwh),
          itemStyle: { color: "#40916c" },
          barWidth: 16,
        },
      ],
      tooltip: {
        trigger: "axis",
        formatter: (params: any[]) => {
          const p = params[0];
          return `${p.name}<br/>Saved: ${p.value} kWh`;
        },
      },
    }),
    []
  );

  const ageBucketOption = useMemo(
    () => ({
      backgroundColor: "transparent",
      grid: { left: 40, right: 10, top: 20, bottom: 35 },
      xAxis: {
        type: "category",
        data: faultAgeBuckets.map((d) => d.bucket),
        axisLabel: { color: "#A7C4B5" },
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
      },
      yAxis: {
        type: "value",
        axisLabel: { color: "#A7C4B5" },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      },
      series: [
        {
          type: "bar",
          data: faultAgeBuckets.map((d) => d.count),
          itemStyle: { color: "#f6c344" },
          barWidth: 20,
        },
      ],
      tooltip: { trigger: "axis" },
    }),
    []
  );

  return (
    <div className="space-y-10">
      <section>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest">
            Master Fault Table
          </h2>
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-faint)]">
            <Clock className="w-3.5 h-3.5" />
            Live synthetic demo data
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as any)}
            className="bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--text)] px-3 py-2 rounded-md"
          >
            <option value="all">All Severity</option>
            <option value="high">High</option>
            <option value="med">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--text)] px-3 py-2 rounded-md"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="ack">Ack</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={oppFilter}
            onChange={(e) =>
              setOppFilter(e.target.value === "all" ? "all" : Number(e.target.value))
            }
            className="bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--text)] px-3 py-2 rounded-md"
          >
            <option value="all">All Opp.</option>
            {[...new Set(fddFaults.map((f) => f.oehOpp))].map((opp) => (
              <option key={opp} value={opp}>
                Opp. {opp}
              </option>
            ))}
          </select>
          <input
            value={equipmentFilter}
            onChange={(e) => setEquipmentFilter(e.target.value)}
            placeholder="Filter by equipment"
            className="bg-[var(--surface)] border border-[var(--border)] text-[12px] text-[var(--text)] px-3 py-2 rounded-md w-52"
          />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Fault Type
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-center text-[var(--text-faint)] uppercase">
                    Opp. #
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Equipment
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    First Detected
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-right text-[var(--text-faint)] uppercase">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-right text-[var(--text-faint)] uppercase">
                    kWh/day Waste
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-center text-[var(--text-faint)] uppercase">
                    Severity
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-center text-[var(--text-faint)] uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFaults.map((fault) => {
                  const sev = severityConfig[fault.severity];
                  const SevIcon = sev.icon;
                  return (
                    <tr
                      key={fault.id}
                      className={cn(
                        "border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors cursor-pointer border-l-[3px]",
                        sev.border
                      )}
                      onClick={() => setSelectedFault(fault)}
                    >
                      <td className="px-4 py-3 text-[13px] font-medium text-[var(--text)]">
                        {fault.faultType}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-center text-[var(--primary-bright)] font-mono">
                        {fault.oehOpp}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[var(--text-muted)]">
                        {fault.equipment}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-[var(--text-muted)]">
                        {new Date(fault.firstDetected).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-[13px] text-right text-[var(--text)] font-mono">
                        {fault.durationDays}d
                      </td>
                      <td className="px-4 py-3 text-[13px] text-right font-mono text-[var(--text)]">
                        {fault.kwhPerDayWaste}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border",
                            sev.color,
                            sev.border.replace("border-l-", "border-")
                          )}
                        >
                          <SevIcon className="w-3.5 h-3.5" />
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase",
                            statusStyles[fault.status]
                          )}
                        >
                          {fault.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="px-5 pt-4 pb-1 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text)]">
                Fault Priority Matrix
              </h3>
              <p className="text-[11px] text-[var(--text-faint)]">
                Y = severity score, X = days active, bubble = kWh/day waste
              </p>
            </div>
          </div>
          <ReactECharts option={priorityOption} style={{ height: 360 }} notMerge />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-md">
            <div className="text-[12px] font-semibold text-[var(--text)] mb-2">
              Active FDD Rules
            </div>
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {fddRules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-3 rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[13px] font-semibold text-[var(--text)]">
                        {rule.name}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-1">
                        {rule.condition}
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-1.5 py-0.5 rounded">
                      Opp. {rule.oehOpp}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(rule.thresholds).map(([k, v]) => (
                      <span
                        key={k}
                        className="text-[10px] bg-[var(--bg)] px-1.5 py-0.5 rounded text-[var(--text-faint)]"
                      >
                        {k}: {v}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest mb-3">
          Fault Resolution Tracker
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md">
            <div className="px-4 pt-3 pb-1">
              <div className="text-[12px] font-semibold text-[var(--text)]">
                Time to Resolve
              </div>
              <div className="text-[11px] text-[var(--text-faint)]">
                Histogram (days to close)
              </div>
            </div>
            <ReactECharts option={resolutionHistogramOption} style={{ height: 220 }} notMerge />
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md">
            <div className="px-4 pt-3 pb-1">
              <div className="text-[12px] font-semibold text-[var(--text)]">
                Energy Savings per Closed Fault
              </div>
              <div className="text-[11px] text-[var(--text-faint)]">kWh recovered</div>
            </div>
            <ReactECharts option={savingsBarOption} style={{ height: 220 }} notMerge />
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md">
            <div className="px-4 pt-3 pb-1">
              <div className="text-[12px] font-semibold text-[var(--text)]">
                Open Fault Age Distribution
              </div>
              <div className="text-[11px] text-[var(--text-faint)]">Days active buckets</div>
            </div>
            <ReactECharts option={ageBucketOption} style={{ height: 220 }} notMerge />
          </div>
        </div>
      </section>

      {selectedFault && (
        <div className="fixed right-6 top-24 w-[360px] max-w-[90vw] bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_16px_50px_rgba(0,0,0,0.45)] p-5 z-30">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[13px] font-semibold text-[var(--text)]">
                {selectedFault.faultType}
              </div>
              <div className="text-[11px] text-[var(--text-faint)]">
                Opp. {selectedFault.oehOpp} · {selectedFault.equipment}
              </div>
            </div>
            <button
              onClick={() => setSelectedFault(null)}
              className="text-[var(--text-faint)] hover:text-[var(--text)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2 text-[12px] text-[var(--text-muted)]">
            <p>{selectedFault.description}</p>
            <div className="flex items-center justify-between text-[11px]">
              <span>Detected: {new Date(selectedFault.firstDetected).toLocaleString()}</span>
              <span>Duration: {selectedFault.durationDays} days</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span>kWh/day waste: {selectedFault.kwhPerDayWaste}</span>
              <span>Status: {selectedFault.status.toUpperCase()}</span>
            </div>
            {selectedFault.resolvedDate && (
              <div className="text-[11px]">
                Resolved: {selectedFault.resolvedDate} — Saved {selectedFault.savedKwh} kWh
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
