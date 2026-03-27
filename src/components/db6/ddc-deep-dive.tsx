"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import {
  pipelineStatuses,
  ddcPoints,
  pointStats,
  binaryTimeline,
  boxPlotSeries,
  qualityFlagTimeline,
  rawDataRows,
} from "@/data/db6";
import { ArrowUp, ArrowDown, Minus, Search } from "lucide-react";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] rounded-md bg-[var(--surface)] animate-pulse" />
  ),
});

type StatsWindow = "24h" | "7d" | "30d";

export function DDCDeepDive() {
  const [selectedDdc, setSelectedDdc] = useState(pipelineStatuses[0]);
  const [statsWindow, setStatsWindow] = useState<StatsWindow>("24h");

  const statsForWindow = useMemo(() => {
    if (statsWindow === "24h") return pointStats;
    if (statsWindow === "7d")
      return pointStats.map((p) => ({
        ...p,
        mean: Number((p.mean * 1.02).toFixed(2)),
        stdDev: Number((p.stdDev * 1.1).toFixed(2)),
      }));
    return pointStats.map((p) => ({
      ...p,
      mean: Number((p.mean * 1.03).toFixed(2)),
      stdDev: Number((p.stdDev * 1.15).toFixed(2)),
    }));
  }, [statsWindow]);

  const boxplotOption = {
    backgroundColor: "transparent",
    grid: { left: 50, right: 16, top: 20, bottom: 40 },
    xAxis: {
      type: "category",
      data: boxPlotSeries.map((b) => b.point),
      axisLabel: { color: "#A7C4B5", rotate: 20, fontSize: 10 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: "#A7C4B5" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
    },
    tooltip: { trigger: "item" },
    series: [
      {
        type: "boxplot",
        data: boxPlotSeries.map((b) => b.stats),
        itemStyle: { color: "rgba(82,183,136,0.35)", borderColor: "#52b788" },
      },
    ],
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          value={selectedDdc.ddcId}
          onChange={(e) => {
            const match = pipelineStatuses.find((d) => d.ddcId === e.target.value);
            if (match) setSelectedDdc(match);
          }}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-md px-3 py-2 text-[13px] text-[var(--text)]"
        >
          {pipelineStatuses.map((ddc) => (
            <option key={ddc.ddcId} value={ddc.ddcId}>
              {ddc.ddcId} — {ddc.name}
            </option>
          ))}
        </select>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-faint)]" />
          <input
            type="text"
            placeholder="Search points..."
            className="pl-9 pr-4 py-2 bg-[var(--surface)] border border-[var(--border)] rounded-md text-[13px] w-64 focus:outline-none focus:border-[var(--primary-bright)]"
          />
        </div>
      </div>

      <section>
        <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest mb-3">
          All Points Live Values
        </h2>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Point Name
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-right text-[var(--text-faint)] uppercase">
                    Current Value
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-center text-[var(--text-faint)] uppercase">
                    1H Trend
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-center text-[var(--text-faint)] uppercase">
                    Point Class
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-center text-[var(--text-faint)] uppercase">
                    Quality
                  </th>
                </tr>
              </thead>
              <tbody>
                {ddcPoints.map((point) => (
                  <tr
                    key={point.name}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <td className="px-4 py-3 text-[13px] font-medium text-[var(--text)]">
                      {point.name}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-right font-mono font-bold text-[var(--text)]">
                      {typeof point.currentValue === "boolean"
                        ? point.currentValue
                          ? "ON"
                          : "OFF"
                        : point.currentValue}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {point.trend1h === "up" && (
                        <ArrowUp className="w-3 h-3 text-[var(--danger)] mx-auto" />
                      )}
                      {point.trend1h === "down" && (
                        <ArrowDown className="w-3 h-3 text-[var(--primary-bright)] mx-auto" />
                      )}
                      {point.trend1h === "stable" && (
                        <Minus className="w-3 h-3 text-[var(--text-faint)] mx-auto" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">
                      {point.unit}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[10px] font-bold bg-[var(--bg)] px-1.5 py-0.5 rounded text-[var(--text-faint)]">
                        {point.pointClass}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full inline-block",
                          point.qualityFlag === "ok"
                            ? "bg-[var(--primary-bright)]"
                            : point.qualityFlag === "suspect"
                            ? "bg-[#f6c344]"
                            : "bg-[var(--danger)]"
                        )}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest mb-3">
            Binary State Timeline
          </h2>
          <div className="space-y-3">
            {binaryTimeline.map((row) => (
              <div key={row.point}>
                <div className="text-[12px] text-[var(--text)] mb-1">{row.point}</div>
                <div className="w-full h-5 rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex">
                  {row.segments.map((seg) => {
                    const pct = segmentPercent(seg.start, seg.end);
                    const color =
                      seg.state === "on"
                        ? "#52b788"
                        : seg.state === "fault"
                        ? "#e57373"
                        : "#4a5568";
                    return (
                      <div
                        key={`${seg.start}-${seg.end}`}
                        style={{ width: `${pct}%`, backgroundColor: color }}
                        className="h-full"
                        title={`${row.point}: ${seg.state.toUpperCase()}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-[var(--text-faint)] mt-2">
            Timeline: last 24h — green=ON, gray=OFF, red=FAULT
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest">
              Statistical Summary
            </h2>
            <div className="flex gap-1">
              {(["24h", "7d", "30d"] as StatsWindow[]).map((w) => (
                <button
                  key={w}
                  onClick={() => setStatsWindow(w)}
                  className={cn(
                    "px-2 py-1 text-[11px] rounded border",
                    statsWindow === w
                      ? "border-[var(--primary-bright)] text-[var(--primary-bright)]"
                      : "border-[var(--border)] text-[var(--text-faint)]"
                  )}
                >
                  {w.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {statsForWindow.map((stat) => (
              <div
                key={stat.name}
                className="p-4 bg-[var(--surface)] border border-[var(--border)] rounded-md"
              >
                <div className="text-[12px] font-semibold text-[var(--text)] mb-2 truncate">
                  {stat.name}
                </div>
                <div className="grid grid-cols-2 gap-y-2">
                  <StatItem label="Min" value={stat.min} />
                  <StatItem label="Max" value={stat.max} />
                  <StatItem label="Mean" value={stat.mean} />
                  <StatItem label="StdDev" value={stat.stdDev} />
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--border)] flex justify-between items-baseline">
                  <span className="text-[10px] text-[var(--text-faint)] uppercase font-bold">
                    Last
                  </span>
                  <span className="text-[16px] font-bold text-[var(--primary-bright)]">
                    {stat.last}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md">
          <div className="px-4 pt-3 pb-1">
            <div className="text-[12px] font-semibold text-[var(--text)]">
              Value Distribution Boxplots
            </div>
            <div className="text-[11px] text-[var(--text-faint)]">
              Outliers shown as whiskers
            </div>
          </div>
          <ReactECharts option={boxplotOption} style={{ height: 280 }} notMerge />
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-4 space-y-3">
          <div>
            <div className="text-[12px] font-semibold text-[var(--text)]">
              Quality Flag Timeline
            </div>
            <div className="text-[11px] text-[var(--text-faint)]">
              OK → SUSPECT → MISSING across 24h
            </div>
          </div>
          <div className="space-y-3">
            {qualityFlagTimeline.map((row) => (
              <div key={row.point}>
                <div className="text-[12px] text-[var(--text)] mb-1">{row.point}</div>
                <div className="w-full h-4 rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex">
                  {row.segments.map((seg) => {
                    const pct = segmentPercent(seg.start, seg.end);
                    const color =
                      seg.status === "ok"
                        ? "#52b788"
                        : seg.status === "suspect"
                        ? "#f6c344"
                        : "#e57373";
                    return (
                      <div
                        key={`${seg.start}-${seg.end}`}
                        style={{ width: `${pct}%`, backgroundColor: color }}
                        className="h-full"
                        title={`${row.point}: ${seg.status.toUpperCase()}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="text-[11px] text-[var(--text-faint)]">
            Red = Missing, Amber = Suspect, Green = OK
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[12px] font-semibold text-[var(--text)]">
              Raw Data Export
            </div>
            <div className="text-[11px] text-[var(--text-faint)]">
              CSV export by DDC and date range
            </div>
          </div>
          <button className="px-3 py-1.5 text-[12px] bg-[var(--primary-bright)] text-white font-semibold rounded-md hover:opacity-90">
            Download CSV
          </button>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text)] px-3 py-2 rounded-md">
            {pipelineStatuses.map((ddc) => (
              <option key={ddc.ddcId} value={ddc.ddcId}>
                {ddc.ddcId} — {ddc.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text)] px-3 py-2 rounded-md"
          />
          <input
            type="date"
            className="bg-[var(--bg)] border border-[var(--border)] text-[12px] text-[var(--text)] px-3 py-2 rounded-md"
          />
        </div>
        <div className="overflow-x-auto border border-[var(--border)] rounded-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                <th className="px-3 py-2 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  Timestamp
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  Point
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  Value
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  Unit
                </th>
                <th className="px-3 py-2 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  Quality
                </th>
              </tr>
            </thead>
            <tbody>
              {rawDataRows.map((row) => (
                <tr
                  key={`${row.timestamp}-${row.point}`}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <td className="px-3 py-2 text-[12px] text-[var(--text-muted)]">
                    {new Date(row.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-[12px] text-[var(--text)]">{row.point}</td>
                  <td className="px-3 py-2 text-[12px] text-[var(--text)] font-mono">
                    {row.value}
                  </td>
                  <td className="px-3 py-2 text-[12px] text-[var(--text-muted)]">
                    {row.unit}
                  </td>
                  <td className="px-3 py-2 text-[12px]">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold",
                        row.qualityFlag === "ok"
                          ? "bg-[rgba(82,183,136,0.15)] text-[var(--primary-bright)]"
                          : row.qualityFlag === "suspect"
                          ? "bg-[rgba(246,195,68,0.12)] text-[#f6c344]"
                          : "bg-[rgba(229,115,115,0.12)] text-[var(--danger)]"
                      )}
                    >
                      {row.qualityFlag.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="text-[10px] text-[var(--text-faint)] uppercase font-bold">
        {label}
      </div>
      <div className="text-[13px] font-mono text-[var(--text)]">{value}</div>
    </div>
  );
}

function segmentPercent(start: string, end: string) {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const total = 24 * 60 * 60 * 1000;
  const span = Math.max(0, endMs - startMs);
  return Math.max(2, (span / total) * 100);
}
