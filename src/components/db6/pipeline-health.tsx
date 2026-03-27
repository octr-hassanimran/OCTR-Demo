"use client";

import dynamic from "next/dynamic";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  pipelineStatuses,
  runFolderCompleteness,
  dataQualityCells,
  sensorCrossChecks,
  infraHealthTrend,
  serviceHealth,
} from "@/data/db6";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] rounded-md bg-[var(--surface)] animate-pulse" />
  ),
});

const statusColor = {
  ok: "text-[var(--primary-bright)]",
  warn: "text-[#f6c344]",
  down: "text-[#e57373]",
};

export function PipelineHealth() {
  const runFolderOption = {
    backgroundColor: "transparent",
    grid: { left: 80, right: 16, top: 18, bottom: 40 },
    tooltip: {
      formatter: (params: { data: number[] }) => {
        const [hour, ddcIdx, completeness] = params.data;
        const ddcId = Array.from(new Set(runFolderCompleteness.map((r) => r.ddcId)))[ddcIdx];
        return `${ddcId} — ${hour}:00<br/>Completeness: ${(completeness * 100).toFixed(0)}%`;
      },
    },
    xAxis: {
      type: "category",
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      axisLabel: { color: "#A7C4B5", fontSize: 10, interval: 1 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
      splitArea: { show: false },
    },
    yAxis: {
      type: "category",
      data: Array.from(new Set(runFolderCompleteness.map((r) => r.ddcId))),
      axisLabel: { color: "#A7C4B5", fontSize: 11 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
      splitArea: { show: false },
    },
    visualMap: {
      min: 0,
      max: 1,
      calculable: false,
      orient: "horizontal" as const,
      left: "center",
      bottom: 4,
      textStyle: { color: "#A7C4B5", fontSize: 10 },
      inRange: {
        color: ["#3a0a0a", "#e57373", "#f6c344", "#52b788"],
      },
    },
    series: [
      {
        name: "Completeness",
        type: "heatmap",
        data: runFolderCompleteness.map((r) => [
          r.hour,
          Array.from(new Set(runFolderCompleteness.map((x) => x.ddcId))).indexOf(r.ddcId),
          r.completeness,
        ]),
        label: {
          show: false,
        },
        emphasis: { itemStyle: { shadowBlur: 8, shadowColor: "rgba(0,0,0,0.5)" } },
        itemStyle: { borderWidth: 2, borderColor: "#0a0f0d", borderRadius: 2 },
      },
    ],
  };

  const dates = Array.from(new Set(dataQualityCells.map((d) => d.date))).sort();
  const ddcIds = Array.from(new Set(dataQualityCells.map((d) => d.ddcId)));
  const statusMap: Record<string, number> = { ok: 3, outlier: 2, suspect: 2, stuck: 1, missing: 0 };
  const statusColorMap: Record<number, string> = {
    0: "#e57373",
    1: "#8f5e10",
    2: "#f6c344",
    3: "#52b788",
  };

  const qualityOption = {
    backgroundColor: "transparent",
    grid: { left: 80, right: 16, top: 18, bottom: 50 },
    tooltip: {
      formatter: (params: { data: any[] }) => {
        const [dayIdx, ddcIdx, statusVal] = params.data;
        const statusLabel =
          Object.entries(statusMap).find(([, v]) => v === statusVal)?.[0] ?? "ok";
        const flagged =
          dataQualityCells.find(
            (c) => c.ddcId === ddcIds[ddcIdx] && c.date === dates[dayIdx]
          )?.flaggedPoints ?? [];
        return `${ddcIds[ddcIdx]} — ${dates[dayIdx]}<br/>Status: ${statusLabel.toUpperCase()}${
          flagged.length ? `<br/>Flagged: ${flagged.join(", ")}` : ""
        }`;
      },
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
      splitArea: { show: false },
    },
    yAxis: {
      type: "category",
      data: ddcIds,
      axisLabel: { color: "#A7C4B5", fontSize: 11 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
      splitArea: { show: false },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 3,
      inRange: { color: Object.values(statusColorMap) },
    },
    series: [
      {
        type: "heatmap",
        data: dataQualityCells.map((c) => [
          dates.indexOf(c.date),
          ddcIds.indexOf(c.ddcId),
          statusMap[c.status],
        ]),
        itemStyle: {
          borderWidth: 2,
          borderColor: "#0a0f0d",
          borderRadius: 2,
          color: (params: any) => statusColorMap[params.value[2]],
        },
      },
    ],
  };

  const infraOption = {
    backgroundColor: "transparent",
    grid: { left: 40, right: 16, top: 20, bottom: 40 },
    xAxis: {
      type: "category",
      data: infraHealthTrend.map((p) => p.time),
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
        name: "Used TB",
        type: "line",
        data: infraHealthTrend.map((p) => p.usedTb),
        areaStyle: { color: "rgba(82,183,136,0.18)" },
        itemStyle: { color: "#52b788" },
      },
      {
        name: "Capacity",
        type: "line",
        data: infraHealthTrend.map((p) => p.capacityTb),
        lineStyle: { type: "dashed", color: "#A7C4B5" },
        itemStyle: { color: "#A7C4B5" },
      },
    ],
    tooltip: { trigger: "axis" },
    legend: { textStyle: { color: "#A7C4B5" } },
  };

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest mb-3">
          DDC Status Table
        </h2>
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  DDC ID
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  Controller Name
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                  Last Raw Reading
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-right text-[var(--text-faint)] uppercase">
                  Curated Lag
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-right text-[var(--text-faint)] uppercase">
                  Points
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold text-right text-[var(--text-faint)] uppercase">
                  Error Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {pipelineStatuses.map((ddc) => (
                <tr
                  key={ddc.ddcId}
                  className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors"
                >
                  <td className="px-4 py-3 text-[13px] font-mono text-[var(--text-muted)]">
                    {ddc.ddcId}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-medium text-[var(--text)]">
                    {ddc.name}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-muted)]">
                    {formatRelativeTime(ddc.lastRawReading)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-right font-mono text-[var(--text)]">
                    {ddc.curatedLagMinutes}m
                  </td>
                  <td className="px-4 py-3 text-[13px] text-right text-[var(--text-muted)]">
                    {ddc.pointsCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={cn(
                        "text-[13px] font-mono",
                        ddc.errorRatePct > 5
                          ? "text-[var(--danger)]"
                          : ddc.errorRatePct > 1
                          ? "text-[#f6c344]"
                          : "text-[var(--primary-bright)]"
                      )}
                    >
                      {ddc.errorRatePct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Run Folder Completeness
            </h3>
            <p className="text-[11px] text-[var(--text-faint)]">
              Expected data files per hour; gaps flagged
            </p>
          </div>
          <ReactECharts option={runFolderOption} style={{ height: 320 }} notMerge />
        </div>

        <div className="rounded-md bg-[var(--surface)] border border-[var(--border)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)]">
          <div className="px-5 pt-4 pb-1">
            <h3 className="text-sm font-semibold text-[var(--text)]">
              Data Quality Flag Heatmap
            </h3>
            <p className="text-[11px] text-[var(--text-faint)]">
              OK / MISSING / OUTLIER / STUCK by day and DDC
            </p>
          </div>
          <ReactECharts option={qualityOption} style={{ height: 320 }} notMerge />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest mb-3">
            Sensor Cross-Validation Alerts
          </h2>
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.02)]">
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Sensor Pair
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Expected Corr.
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Divergence
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Duration
                  </th>
                  <th className="px-4 py-3 text-[11px] font-semibold text-[var(--text-faint)] uppercase">
                    Affected Strategies
                  </th>
                </tr>
              </thead>
              <tbody>
                {sensorCrossChecks.map((row) => (
                  <tr
                    key={row.pair}
                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface-hover)] transition-colors"
                  >
                    <td className="px-4 py-3 text-[13px] text-[var(--text)]">
                      {row.pair}
                      {row.note && (
                        <div className="text-[11px] text-[var(--text-faint)] mt-1">
                          {row.note}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">
                      {row.expectedCorrelation}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--danger)]">
                      {row.divergence}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">
                      {row.duration}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-[var(--text-muted)]">
                      {row.affectedStrategies}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md">
            <div className="px-4 pt-3 pb-1">
              <div className="text-[12px] font-semibold text-[var(--text)]">
                Infrastructure Health
              </div>
              <div className="text-[11px] text-[var(--text-faint)]">
                Storage usage & capacity
              </div>
            </div>
            <ReactECharts option={infraOption} style={{ height: 200 }} notMerge />
          </div>

          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-4 space-y-3">
            <div className="text-[12px] font-semibold text-[var(--text)]">
              Service Health Indicators
            </div>
            <div className="space-y-2">
              {serviceHealth.map((s) => (
                <div
                  key={s.name}
                  className="flex items-start justify-between p-2 rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)]"
                >
                  <div>
                    <div className="text-[12px] font-semibold text-[var(--text)]">
                      {s.name}
                    </div>
                    <div className="text-[11px] text-[var(--text-faint)]">
                      Last restart: {new Date(s.lastRestart).toLocaleString()}
                    </div>
                    <div className="text-[11px] text-[var(--text-faint)]">
                      Errors (24h): {s.errorCount24h}
                      {s.coldStarts7d !== undefined &&
                        ` · Cold starts (7d): ${s.coldStarts7d}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-[12px] font-bold",
                        statusColor[s.status]
                      )}
                    >
                      {s.uptimePct.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-[var(--text-faint)] uppercase">
                      {s.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
