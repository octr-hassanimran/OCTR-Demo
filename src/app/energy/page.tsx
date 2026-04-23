"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import * as echarts from "echarts";
import { AlertCircle, Info, Zap, Download, ChevronDown } from "lucide-react";
import {
  calendarHeatmap,
  demandProfile,
  demandResponse,
  energyKpis,
  hvacSubmeterTrend,
  intervalMeterRows,
  kpiSparklines,
  loadFactorTarget,
  loadFactorTrend,
  meterStatuses,
  meterVsBms,
  meterVsBmsThresholdKw,
  monthDemandEventTime,
  monthlyCostBreakdown,
  powerFactorThreshold,
  sankeyFlows,
  touBreakdown,
  touWindows,
  weatherCorrelation,
} from "@/data/energy";
import { octrTheme } from "@/lib/echarts-theme";
import { formatRelativeTime } from "@/lib/utils";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] rounded-md bg-[var(--surface)] animate-pulse" />
  ),
});

echarts.registerTheme("octr", octrTheme);

const CARD =
  "bg-[var(--surface)] border border-[rgba(255,255,255,0.06)] rounded-md shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_6px_28px_rgba(0,0,0,0.25)]";

type CalendarSelection = { date: string; hour: number; kw: number };

export default function EnergyHubPage() {
  const [selectedCalendar, setSelectedCalendar] = useState<CalendarSelection | null>(null);
  const selectedHour = selectedCalendar?.hour ?? null;

  return (
    <div className="min-h-screen">
      <div className="px-8 pt-7 pb-1">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-[var(--text)]">Energy Hub</h1>
          <span className="text-[11px] font-medium text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-2 py-0.5 rounded-full">
            DB-4
          </span>
          <span className="text-[11px] text-[var(--text-faint)]">/energy</span>
        </div>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Demand management, sub-metering transparency, and tariff intelligence
        </p>
      </div>

      <div className="px-8 pb-10 space-y-6">
        <EnergyKPIRow />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-3">
            <MeterHealthPanel />
          </div>
        </div>

        <DemandProfileSection selectedHour={selectedHour} selectionLabel={selectedCalendar} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <EnergyCalendar onSelect={setSelectedCalendar} selected={selectedCalendar} />
          <TouPie />
        </div>

        <MeteringDrilldowns />

        <TariffAccordion />
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Row 1 — KPI Tiles
// -----------------------------------------------------------------------------

function EnergyKPIRow() {
  const cards = useMemo(
    () => [
      {
        title: "Current kW Demand",
        value: energyKpis.currentKw.toLocaleString(),
        unit: "kW",
        delta: +4.2,
        deltaLabel: "vs 15-min avg",
        spark: kpiSparklines.currentKw,
        live: true,
      },
      {
        title: "Today’s Peak kW",
        value: energyKpis.todayPeakKw.toLocaleString(),
        unit: "kW",
        delta: +1.6,
        deltaLabel: `@ ${energyKpis.todayPeakTime}`,
        spark: kpiSparklines.todayPeakKw,
      },
      {
        title: "This Month’s Peak kW",
        value: energyKpis.monthPeakKw.toLocaleString(),
        unit: "kW",
        delta: +3.1,
        deltaLabel: "Driver for demand charge",
        spark: kpiSparklines.monthPeakKw,
      },
      {
        title: "Contract Limit",
        value: energyKpis.contractLimitKw.toLocaleString(),
        unit: "kW",
        delta: Math.round((energyKpis.monthPeakKw / energyKpis.contractLimitKw) * 100),
        deltaLabel: "of limit used",
        spark: [],
      },
      {
        title: "Power Factor",
        value: energyKpis.powerFactor.toFixed(2),
        unit: "",
        delta: energyKpis.powerFactor - powerFactorThreshold,
        deltaLabel: `Threshold ${powerFactorThreshold}`,
        spark: kpiSparklines.powerFactor,
      },
      {
        title: "EUI",
        value: energyKpis.eui.toFixed(0),
        unit: "kWh/m²/yr",
        delta: energyKpis.euiBenchmark - energyKpis.eui,
        deltaLabel: `${energyKpis.euiBenchmark} benchmark`,
        spark: kpiSparklines.eui,
      },
    ],
    [],
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
      {cards.map((card, i) => {
        const contractWarning = card.title === "Contract Limit" && energyKpis.monthPeakKw >= energyKpis.contractLimitKw * 0.9;
        const isPositive =
          card.title === "Contract Limit" ? !contractWarning : card.delta >= 0;
        const deltaDisplay =
          card.title === "Contract Limit"
            ? `${card.delta.toFixed(0)}% ${card.deltaLabel}`
            : `${card.delta > 0 ? "+" : ""}${card.delta.toFixed(1)} ${card.deltaLabel}`;
        return (
          <div
            key={card.title}
            className={`${CARD} relative p-4 transition-all duration-200 hover:-translate-y-[1px]`}
            style={{
              boxShadow: contractWarning
                ? "0 0 0 1px rgba(229,115,115,0.35), 0 12px 40px rgba(229,115,115,0.18)"
                : undefined,
            }}
          >
            {card.live && (
              <span className="absolute right-3 top-3 flex items-center gap-1 text-[10px] text-[var(--primary-bright)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-bright)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--primary-bright)]" />
                </span>
                Live
              </span>
            )}

            <div className="text-[11px] text-[var(--text-faint)] font-semibold uppercase tracking-wider mb-3">
              {card.title}
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-[var(--text)] leading-none">
                    {card.value}
                  </span>
                  {card.unit && (
                    <span className="text-xs text-[var(--text-faint)]">{card.unit}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1.5">
                  <span
                    className={`text-[10px] font-medium ${
                      card.delta === 0
                        ? "text-[var(--text-faint)]"
                        : isPositive
                          ? "text-[var(--primary-bright)]"
                          : "text-[var(--danger)]"
                    }`}
                  >
                    {deltaDisplay}
                  </span>
                </div>
              </div>

              {card.spark.length > 1 ? (
                <Sparkline data={card.spark} id={`energy-${i}`} />
              ) : card.title === "Power Factor" ? (
                <div className="flex flex-col items-end">
                  <MiniGauge value={energyKpis.powerFactor} min={0.8} max={1} threshold={powerFactorThreshold} />
                  <span className="text-[10px] text-[var(--text-faint)] mt-1">Penalty below {powerFactorThreshold}</span>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Sparkline({ data, id }: { data: number[]; id: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 38;
  const width = 84;
  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * (height - 6) - 3,
  }));
  return (
    <div className="w-[84px] h-[38px]">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52b788" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#52b788" stopOpacity={0} />
          </linearGradient>
        </defs>
        <polyline
          points={points.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#52b788"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={0.9}
        />
        <polygon
          points={`0,${height} ${points.map((p) => `${p.x},${p.y}`).join(" ")} ${width},${height}`}
          fill={`url(#spark-${id})`}
        />
      </svg>
    </div>
  );
}

function MiniGauge({
  value,
  min,
  max,
  threshold,
}: {
  value: number;
  min: number;
  max: number;
  threshold: number;
}) {
  const pct = Math.min(Math.max((value - min) / (max - min), 0), 1);
  return (
    <div className="relative w-16 h-16">
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(#52b788 ${pct * 360}deg, rgba(255,255,255,0.06) 0deg)`,
        }}
      />
      <div className="absolute inset-[6px] rounded-full bg-[var(--surface)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-sm font-semibold text-[var(--text)] leading-none">{value.toFixed(2)}</div>
          <div className="text-[9px] text-[var(--text-faint)]">PF</div>
        </div>
      </div>
      <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 text-[10px] text-[var(--text-faint)]">
        Threshold {threshold.toFixed(2)}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Row 2 — Sub-metering & Meter Health
// -----------------------------------------------------------------------------

function SubmeterSankey() {
  const nodes = Array.from(
    new Set(sankeyFlows.flatMap((f) => [f.source, f.target])),
  ).map((name) => ({ name }));

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item" as const,
      backgroundColor: "rgba(17,27,22,0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      textStyle: { color: "#E8F5E9" },
      formatter: (params: any) => {
        if (params.dataType === "edge") {
          return `${params.data.source} → ${params.data.target}<br/><b>${params.data.value.toLocaleString()} kWh</b>`;
        }
        return params.name;
      },
    },
    series: [
      {
        type: "sankey" as const,
        data: nodes,
        links: sankeyFlows,
        nodeAlign: "justify" as const,
        draggable: false,
        emphasis: { focus: "adjacency" as const },
        label: {
          color: "#E8F5E9",
          fontSize: 11,
          formatter: (p: any) => `${p.name}`,
        },
        lineStyle: {
          color: "source",
          curveness: 0.5,
          opacity: 0.6,
        },
        itemStyle: {
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          color: (p: any) =>
            p.name === "Identified Waste" ? "rgba(229,115,115,0.7)" : "#2D6A4F",
        },
        animationDuration: 600,
        animationEasing: "cubicOut",
      },
    ],
  };

  return (
    <div className={`${CARD} p-5 h-full`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--text)]">Sub-Meter Breakdown</h3>
          <p className="text-[11px] text-[var(--text-faint)]">
            Sankey view with waste branch and virtual/physical legend
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[var(--text-faint)]">
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-[#52b788]" /> Physical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-2 rounded-sm bg-[#e57373]" /> Waste
          </span>
        </div>
      </div>
      <ReactECharts option={option} theme="octr" style={{ height: 360 }} notMerge />
    </div>
  );
}

function MeterHealthPanel() {
  const statusColor = {
    ok: "#52b788",
    stale: "#f6c344",
    offline: "#e57373",
  } as const;

  return (
    <div className={`${CARD} p-5 h-full space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--text)]">Meter Health</h3>
          <p className="text-[11px] text-[var(--text-faint)]">
            Last reading, comm status, and data completeness
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[var(--text-faint)]">
          <Info className="w-3.5 h-3.5" />
          <span>Solid border = physical · Dashed = virtual</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {meterStatuses.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded-md border bg-[var(--surface-hover)]`}
            style={{
              borderStyle: m.isVirtual ? "dashed" : "solid",
              borderColor: `${statusColor[m.commStatus]}33`,
              boxShadow: `0 0 0 1px rgba(255,255,255,0.04)`,
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-wide">
                {m.id}
              </div>
              <span
                className="text-[10px] px-2 py-[3px] rounded-full font-semibold flex items-center gap-1"
                style={{
                  color: statusColor[m.commStatus],
                  background: `${statusColor[m.commStatus]}22`,
                  border: `1px solid ${statusColor[m.commStatus]}33`,
                }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: statusColor[m.commStatus] }} />
                {m.commStatus}
              </span>
            </div>
            <div className="text-[13px] font-medium text-[var(--text)] truncate">{m.name}</div>
            <div className="text-[11px] text-[var(--text-muted)]">
              {formatRelativeTime(m.lastReading)} • {m.type}
              {m.isVirtual ? " (virtual)" : ""}
            </div>
            <div className="mt-2">
              <div className="flex items-center justify-between text-[10px] text-[var(--text-faint)] mb-1">
                <span>Data completeness</span>
                <span className="text-[var(--text)] font-semibold">{m.completeness}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${m.completeness}%`,
                    background: `linear-gradient(90deg, ${statusColor[m.commStatus]} 0%, #52b788 100%)`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-[11px] text-[var(--text-faint)]">
        <AlertCircle className="w-3.5 h-3.5 mt-[2px]" />
        <span>
          Virtual meters use engineering estimates and proportional allocation. Physical meters use solid borders;
          virtual meters use dashed. Tooltip explains data confidence and last validation date.
        </span>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Row 3 — Demand Profile
// -----------------------------------------------------------------------------

function DemandProfileSection({
  selectedHour,
  selectionLabel,
}: {
  selectedHour: number | null;
  selectionLabel: CalendarSelection | null;
}) {
  const times = demandProfile.map((d) => d.time);
  const todayVals = demandProfile.map((d) => d.todayKw);
  const yesterdayVals = demandProfile.map((d) => d.yesterdayKw);
  const avgVals = demandProfile.map((d) => d.avg7dKw);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "rgba(17,27,22,0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      textStyle: { color: "#E8F5E9" },
      axisPointer: {
        type: "cross" as const,
        lineStyle: { color: "rgba(82,183,136,0.3)" },
      },
      formatter: (params: any) => {
        const p = params as any[];
        const time = p[0]?.axisValue;
        const today = p.find((x) => x.seriesName === "Today")?.data;
        const yesterday = p.find((x) => x.seriesName === "Yesterday")?.data;
        const avg = p.find((x) => x.seriesName === "7-day Avg")?.data;
        return `
          <div>
            <div class="text-[13px] font-semibold mb-1">${time}</div>
            <div class="flex justify-between gap-4 text-[12px] mb-1">
              <span class="text-[var(--text-faint)]">Today</span>
              <span class="text-[var(--text)] font-semibold">${today} kW</span>
            </div>
            <div class="flex justify-between gap-4 text-[12px] mb-1">
              <span class="text-[var(--text-faint)]">Yesterday</span>
              <span class="text-[var(--text)] font-semibold">${yesterday} kW</span>
            </div>
            <div class="flex justify-between gap-4 text-[12px]">
              <span class="text-[var(--text-faint)]">7-day Avg</span>
              <span class="text-[var(--text)] font-semibold">${avg} kW</span>
            </div>
          </div>
        `;
      },
    },
    legend: {
      data: ["Today", "Yesterday", "7-day Avg"],
      textStyle: { color: "#A7C4B5", fontSize: 11 },
      top: 6,
    },
    grid: { left: 50, right: 16, top: 34, bottom: 32 },
    xAxis: {
      type: "category" as const,
      data: times,
      boundaryGap: false,
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
    },
    yAxis: {
      type: "value" as const,
      name: "kW",
      nameTextStyle: { color: "#6F8578", fontSize: 10 },
      axisLine: { show: false },
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
    },
    series: [
      {
        name: "Today",
        type: "line",
        smooth: 0.35,
        symbol: "none",
        data: todayVals,
        lineStyle: { color: "#52B788", width: 2.4 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(82,183,136,0.35)" },
              { offset: 1, color: "rgba(82,183,136,0.02)" },
            ],
          },
        },
        markArea: {
          silent: true,
          data: touWindows.map((w) => [
            {
              xAxis: w.start,
              itemStyle: { color: "rgba(246,195,68,0.05)" },
              label: {
                show: true,
                formatter: w.label,
                color: "#f6c344",
                fontSize: 10,
                position: "insideTop",
              },
            },
            { xAxis: w.end },
          ]),
        },
      },
      {
        name: "Yesterday",
        type: "line",
        smooth: 0.35,
        symbol: "none",
        data: yesterdayVals,
        lineStyle: { color: "#2D6A4F", width: 1.6, type: "dashed" as const },
      },
      {
        name: "7-day Avg",
        type: "line",
        smooth: 0.35,
        symbol: "none",
        data: avgVals,
        lineStyle: { color: "#40916C", width: 1.2, opacity: 0.7 },
        areaStyle: { color: "rgba(45,106,79,0.08)" },
      },
    ],
    markLine: {
      symbol: "none" as const,
      data: [
        {
          xAxis: monthDemandEventTime,
          lineStyle: { color: "#e57373", type: "solid", width: 1.2 },
          label: {
            show: true,
            formatter: "Demand charge locked",
            position: "insideEndTop" as const,
            color: "#e57373",
            fontSize: 10,
          },
        },
        ...(selectedHour !== null
          ? [
              {
                xAxis: `${String(selectedHour).padStart(2, "0")}:00`,
                lineStyle: { color: "#6cb2ff", type: "dashed", width: 1 },
                label: {
                  show: true,
                  formatter: "From calendar",
                  position: "insideStartTop" as const,
                  color: "#6cb2ff",
                  fontSize: 10,
                },
              },
            ]
          : []),
      ],
    },
  };

  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--text)]">24H Demand Profile</h3>
          <p className="text-[11px] text-[var(--text-faint)]">
            Today vs yesterday vs 7-day average with TOU bands and demand-charge marker
          </p>
        </div>
        {selectionLabel && (
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-faint)] px-2.5 py-1 rounded-full border border-[rgba(108,178,255,0.35)] bg-[rgba(108,178,255,0.08)]">
            <Zap className="w-3.5 h-3.5 text-[#6cb2ff]" />
            Clicked {selectionLabel.date} @ {String(selectionLabel.hour).padStart(2, "0")}:00 — {selectionLabel.kw} kW
          </div>
        )}
      </div>

      <ReactECharts option={option} theme="octr" style={{ height: 340, width: "100%" }} notMerge />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Row 4 — Calendar Heatmap + TOU Pie
// -----------------------------------------------------------------------------

function EnergyCalendar({
  onSelect,
  selected,
}: {
  onSelect: (sel: CalendarSelection) => void;
  selected: CalendarSelection | null;
}) {
  const dayLabels = useMemo(() => {
    const days = Array.from(new Set(calendarHeatmap.map((c) => c.date))).sort();
    return days;
  }, []);

  const data = calendarHeatmap.map((c) => [
    c.hour,
    dayLabels.indexOf(c.date),
    c.kw,
  ]);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      position: "top" as const,
      backgroundColor: "rgba(17,27,22,0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      textStyle: { color: "#E8F5E9" },
      formatter: (p: any) => {
        const [hour, dayIdx, kw] = p.data;
        return `${dayLabels[dayIdx]} ${padHour(hour)}:00<br/><b>${kw} kW</b>`;
      },
    },
    grid: { left: 80, right: 16, top: 20, bottom: 24 },
    xAxis: {
      type: "category" as const,
      data: Array.from({ length: 24 }, (_, i) => padHour(i)),
      splitArea: { show: true, areaStyle: { color: ["transparent", "transparent"] } },
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
    },
    yAxis: {
      type: "category" as const,
      data: dayLabels,
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
      splitArea: { show: true, areaStyle: { color: ["transparent", "transparent"] } },
    },
    visualMap: {
      min: Math.min(...calendarHeatmap.map((c) => c.kw)),
      max: Math.max(...calendarHeatmap.map((c) => c.kw)),
      calculable: false,
      orient: "horizontal" as const,
      left: "center",
      bottom: 0,
      textStyle: { color: "#A7C4B5", fontSize: 10 },
      inRange: {
        color: ["#0b1410", "#1f3d2f", "#2d6a4f", "#52b788", "#95d5b2"],
      },
    },
    series: [
      {
        name: "kW",
        type: "heatmap" as const,
        data,
        label: { show: false },
        emphasis: {
          itemStyle: {
            borderColor: "#6cb2ff",
            borderWidth: 1,
          },
        },
      },
    ],
  };

  return (
    <div className={`${CARD} p-5 lg:col-span-2`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--text)]">Energy Calendar (Last 30 days)</h3>
          <p className="text-[11px] text-[var(--text-faint)]">
            Click a cell to load that hour into the demand profile
          </p>
        </div>
        {selected && (
          <div className="text-[11px] text-[var(--text-faint)]">
            Selected {selected.date} @ {padHour(selected.hour)}:00
          </div>
        )}
      </div>
      <ReactECharts
        option={option}
        theme="octr"
        style={{ height: 360, width: "100%" }}
        notMerge
        onEvents={{
          click: (p: any) => {
            const [hour, dayIdx, kw] = p.data as [number, number, number];
            onSelect({ hour, date: dayLabels[dayIdx], kw });
          },
        }}
      />
    </div>
  );
}

function padHour(h: number) {
  return String(h).padStart(2, "0");
}

function TouPie() {
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item" as const,
      formatter: "{b}: {d}%<br/>{c} kWh",
    },
    legend: {
      top: 6,
      textStyle: { color: "#A7C4B5", fontSize: 11 },
    },
    series: [
      {
        name: "TOU",
        type: "pie" as const,
        radius: ["40%", "65%"],
        label: { color: "#E8F5E9", formatter: "{b}\n{d}%" },
        data: touBreakdown.map((t) => ({
          name:
            t.period === "peak"
              ? "Peak"
              : t.period === "mid"
                ? "Mid"
                : "Off-peak",
          value: t.kwh,
        })),
        itemStyle: {
          borderColor: "rgba(0,0,0,0.35)",
          borderWidth: 1,
        },
      },
    ],
  };

  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-[15px] font-semibold text-[var(--text)]">Time-of-Use Breakdown</h3>
          <p className="text-[11px] text-[var(--text-faint)]">
            % energy and cost by tariff band
          </p>
        </div>
        <a
          href="#"
          className="text-[11px] text-[var(--primary-bright)] hover:underline"
          title="Setpoint adjustments and shifting to off-peak"
        >
          See OEH Opp. 2 →
        </a>
      </div>
      <ReactECharts option={option} theme="octr" style={{ height: 320, width: "100%" }} notMerge />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Row 5 — Metering Drill-downs
// -----------------------------------------------------------------------------

function MeteringDrilldowns() {
  return (
    <div className={`${CARD} p-1`}>
      <details open className="group">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-[13px] font-semibold text-[var(--text)] select-none">
          <span>Metering Drill-Downs</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 space-y-4">
          <HVACSubmeterTrend />
          <IntervalMeterTable />
          <MeterVsBms />
        </div>
      </details>
    </div>
  );
}

function HVACSubmeterTrend() {
  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "rgba(17,27,22,0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      textStyle: { color: "#E8F5E9" },
    },
    legend: {
      data: ["Chiller", "AHU Fans", "Pumps"],
      textStyle: { color: "#A7C4B5", fontSize: 11 },
      top: 4,
    },
    grid: { left: 40, right: 16, top: 32, bottom: 30 },
    xAxis: {
      type: "category" as const,
      data: hvacSubmeterTrend.map((d) => d.day),
      axisLabel: { color: "#A7C4B5", fontSize: 10, interval: 3 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    yAxis: {
      type: "value" as const,
      name: "kWh/day",
      nameTextStyle: { color: "#6F8578", fontSize: 10 },
      axisLine: { show: false },
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
    },
    series: [
      {
        name: "Chiller",
        type: "line",
        stack: "hvac",
        smooth: 0.3,
        areaStyle: { color: "rgba(82,183,136,0.25)" },
        lineStyle: { width: 1.6, color: "#52b788" },
        data: hvacSubmeterTrend.map((d) => d.chiller),
      },
      {
        name: "AHU Fans",
        type: "line",
        stack: "hvac",
        smooth: 0.3,
        areaStyle: { color: "rgba(64,145,108,0.22)" },
        lineStyle: { width: 1.4, color: "#40916c" },
        data: hvacSubmeterTrend.map((d) => d.fans),
      },
      {
        name: "Pumps",
        type: "line",
        stack: "hvac",
        smooth: 0.3,
        areaStyle: { color: "rgba(45,106,79,0.2)" },
        lineStyle: { width: 1.2, color: "#2d6a4f" },
        data: hvacSubmeterTrend.map((d) => d.pumps),
      },
    ],
  };

  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-[13px] font-semibold text-[var(--text)]">HVAC Sub-Meter Trend (30 days)</h4>
          <p className="text-[11px] text-[var(--text-faint)]">Stacked area: chiller + fans + pumps</p>
        </div>
      </div>
      <ReactECharts option={option} theme="octr" style={{ height: 260, width: "100%" }} notMerge />
    </div>
  );
}

function IntervalMeterTable() {
  const [filter, setFilter] = useState<string>("all");

  const meters = Array.from(new Set(intervalMeterRows.map((r) => r.meterId)));
  const filtered = filter === "all" ? intervalMeterRows : intervalMeterRows.filter((r) => r.meterId === filter);

  function downloadCsv() {
    const header = ["timestamp", "meterId", "meterName", "kWh", "kW demand", "power factor"];
    const rows = filtered.map((r) => [
      r.timestamp,
      r.meterId,
      r.meterName,
      r.kwh,
      r.kwDemand,
      r.powerFactor,
    ]);
    const csv = [header, ...rows]
      .map((line) => line.map((v) => `"${v}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interval-meter-data.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div>
          <h4 className="text-[13px] font-semibold text-[var(--text)]">Interval Meter Data</h4>
          <p className="text-[11px] text-[var(--text-faint)]">15/30-minute data, sortable/filterable + CSV download</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[var(--surface-hover)] border border-[var(--border)] text-[11px] rounded px-2 py-1 text-[var(--text)]"
          >
            <option value="all">All meters</option>
            {meters.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <button
            onClick={downloadCsv}
            className="flex items-center gap-1 px-2 py-1 text-[11px] rounded border border-[var(--border)] text-[var(--text)] hover:border-[var(--primary-bright)]"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      <div className="overflow-auto max-h-[260px]">
        <table className="w-full text-left text-[12px]">
          <thead className="sticky top-0 bg-[var(--surface)]">
            <tr className="text-[11px] text-[var(--text-faint)]">
              <th className="py-2 pr-3 font-semibold">Timestamp</th>
              <th className="py-2 pr-3 font-semibold">Meter</th>
              <th className="py-2 pr-3 font-semibold">kWh</th>
              <th className="py-2 pr-3 font-semibold">kW Demand</th>
              <th className="py-2 pr-3 font-semibold">Power Factor</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, idx) => (
              <tr
                key={idx}
                className="border-t border-[rgba(255,255,255,0.04)] hover:bg-[var(--surface-hover)]"
              >
                <td className="py-2 pr-3 text-[var(--text)]">{r.timestamp}</td>
                <td className="py-2 pr-3 text-[var(--text)]">{r.meterName} ({r.meterId})</td>
                <td className="py-2 pr-3 text-[var(--text)]">{r.kwh.toFixed(1)}</td>
                <td className="py-2 pr-3 text-[var(--text)]">{r.kwDemand.toFixed(0)}</td>
                <td className="py-2 pr-3 text-[var(--text)]">{r.powerFactor.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MeterVsBms() {
  const diffs = meterVsBms.map((p) => p.meterKw - p.bmsKw);

  const option = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" as const },
    legend: {
      data: ["Meter", "BMS Calc", "Δ"],
      textStyle: { color: "#A7C4B5", fontSize: 11 },
      top: 4,
    },
    grid: { left: 46, right: 16, top: 32, bottom: 30 },
    xAxis: {
      type: "category" as const,
      data: meterVsBms.map((p) => p.timestamp),
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    yAxis: [
      {
        type: "value" as const,
        name: "kW",
        nameTextStyle: { color: "#6F8578", fontSize: 10 },
        axisLabel: { color: "#A7C4B5", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
      },
      {
        type: "value" as const,
        name: "Δ kW",
        nameTextStyle: { color: "#6F8578", fontSize: 10 },
        axisLabel: { color: "#A7C4B5", fontSize: 10 },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "Meter",
        type: "line",
        smooth: 0.3,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#52b788" },
        data: meterVsBms.map((p) => p.meterKw),
      },
      {
        name: "BMS Calc",
        type: "line",
        smooth: 0.3,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#6cb2ff" },
        data: meterVsBms.map((p) => p.bmsKw),
      },
      {
        name: "Δ",
        type: "bar",
        yAxisIndex: 1,
        barWidth: 12,
        data: diffs,
        itemStyle: {
          color: (p: any) =>
            Math.abs(p.value) > meterVsBmsThresholdKw ? "rgba(229,115,115,0.8)" : "rgba(82,183,136,0.4)",
        },
        markLine: {
          symbol: "none" as const,
          lineStyle: { color: "rgba(229,115,115,0.7)", type: "dashed" as const },
          data: [
            { yAxis: meterVsBmsThresholdKw },
            { yAxis: -meterVsBmsThresholdKw },
          ],
        },
      },
    ],
  };

  return (
    <div className={`${CARD} p-4`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-[13px] font-semibold text-[var(--text)]">Meter vs BMS Cross-Check</h4>
          <p className="text-[11px] text-[var(--text-faint)]">
            Flag discrepancies above ±{meterVsBmsThresholdKw} kW
          </p>
        </div>
        <span className="text-[11px] text-[var(--danger)] font-semibold bg-[rgba(229,115,115,0.12)] border border-[rgba(229,115,115,0.3)] rounded-full px-2 py-1">
          Sensor or calibration discrepancy alert
        </span>
      </div>
      <ReactECharts option={option} theme="octr" style={{ height: 260, width: "100%" }} notMerge />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Row 6 — Tariff & Financial Intelligence
// -----------------------------------------------------------------------------

function TariffAccordion() {
  return (
    <div className={`${CARD} p-1`}>
      <details open className="group">
        <summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-[13px] font-semibold text-[var(--text)] select-none">
          <span>Tariff & Financial Intelligence</span>
          <ChevronDown className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-5 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <MonthlyCostChart />
            <LoadFactorChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PowerFactorMonitor />
            <DemandResponseReadiness />
            <WeatherCorrelationChart />
          </div>
        </div>
      </details>
    </div>
  );
}

function MonthlyCostChart() {
  const option = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" as const },
    legend: {
      data: ["Energy", "Demand", "PF Penalty", "Reactive"],
      textStyle: { color: "#A7C4B5", fontSize: 11 },
      top: 6,
    },
    grid: { left: 48, right: 16, top: 36, bottom: 28 },
    xAxis: {
      type: "category" as const,
      data: monthlyCostBreakdown.map((m) => m.month),
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    yAxis: {
      type: "value" as const,
      name: "₩",
      nameTextStyle: { color: "#6F8578", fontSize: 10 },
      axisLabel: {
        color: "#A7C4B5",
        fontSize: 10,
        formatter: (v: number) => `${(v / 1_000_000).toFixed(0)}M`,
      },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
    },
    series: [
      {
        name: "Energy",
        type: "bar",
        stack: "cost",
        itemStyle: { color: "#52b788" },
        data: monthlyCostBreakdown.map((m) => m.energyCharge),
      },
      {
        name: "Demand",
        type: "bar",
        stack: "cost",
        itemStyle: { color: "#2d6a4f" },
        data: monthlyCostBreakdown.map((m) => m.demandCharge),
      },
      {
        name: "PF Penalty",
        type: "bar",
        stack: "cost",
        itemStyle: { color: "#e57373" },
        data: monthlyCostBreakdown.map((m) => m.pfPenalty),
      },
      {
        name: "Reactive",
        type: "bar",
        stack: "cost",
        itemStyle: { color: "#6cb2ff" },
        data: monthlyCostBreakdown.map((m) => m.reactiveCharge),
      },
    ],
  };

  return (
    <div className={`${CARD} p-4`}>
      <h4 className="text-[13px] font-semibold text-[var(--text)] mb-2">
        Monthly Cost Breakdown
      </h4>
      <ReactECharts option={option} theme="octr" style={{ height: 240, width: "100%" }} notMerge />
    </div>
  );
}

function LoadFactorChart() {
  const option = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" as const },
    grid: { left: 40, right: 16, top: 24, bottom: 28 },
    xAxis: {
      type: "category" as const,
      data: loadFactorTrend.map((m) => m.month),
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
    },
    yAxis: {
      type: "value" as const,
      min: 0.5,
      max: 0.9,
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
    },
    series: [
      {
        name: "Load Factor",
        type: "line",
        smooth: 0.3,
        symbol: "circle",
        symbolSize: 6,
        itemStyle: { color: "#52b788" },
        lineStyle: { width: 2 },
        data: loadFactorTrend.map((m) => m.loadFactor),
        markLine: {
          symbol: "none" as const,
          lineStyle: { color: "#6cb2ff", type: "dashed" as const },
          label: {
            show: true,
            formatter: `Target ${loadFactorTarget}`,
            color: "#6cb2ff",
            fontSize: 10,
          },
          data: [{ yAxis: loadFactorTarget }],
        },
      },
    ],
  };

  return (
    <div className={`${CARD} p-4`}>
      <h4 className="text-[13px] font-semibold text-[var(--text)] mb-2">
        Load Factor Trend
      </h4>
      <ReactECharts option={option} theme="octr" style={{ height: 240, width: "100%" }} notMerge />
    </div>
  );
}

function PowerFactorMonitor() {
  const pf = energyKpis.powerFactor;
  const pct = Math.min(pf / powerFactorThreshold, 1);

  return (
    <div className={`${CARD} p-4 flex items-center gap-4`}>
      <div
        className="relative w-28 h-28 rounded-full border border-[rgba(255,255,255,0.08)]"
        style={{
          background: `conic-gradient(${pf < powerFactorThreshold ? "#e57373" : "#52b788"} ${pct * 360}deg, rgba(255,255,255,0.06) 0deg)`,
        }}
      >
        <div className="absolute inset-[10px] rounded-full bg-[var(--surface)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-[var(--text)]">{pf.toFixed(2)}</div>
            <div className="text-[10px] text-[var(--text-faint)]">Current PF</div>
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <h4 className="text-[13px] font-semibold text-[var(--text)]">Power Factor Monitor</h4>
        <div className="text-[11px] text-[var(--text-faint)]">
          Penalty threshold {powerFactorThreshold.toFixed(2)} — financial alert if breached
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-bright)]" />
          <span className="text-[var(--text-muted)]">Healthy</span>
          <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] ml-3" />
          <span className="text-[var(--text-muted)]">Penalty risk</span>
        </div>
        {pf < powerFactorThreshold && (
          <div className="text-[11px] text-[var(--danger)] font-semibold">
            Estimated penalty: ₩{((powerFactorThreshold - pf) * 12_000_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
        )}
      </div>
    </div>
  );
}

function DemandResponseReadiness() {
  return (
    <div className={`${CARD} p-4`}>
      <h4 className="text-[13px] font-semibold text-[var(--text)] mb-2">Demand Response Readiness</h4>
      <div className="text-[11px] text-[var(--text-faint)] mb-2">
        Estimated shed potential for next DR event
      </div>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-[var(--text)]">{demandResponse.potentialKw}</span>
        <span className="text-[11px] text-[var(--text-faint)]">kW available</span>
      </div>
      <div className="space-y-2">
        {demandResponse.loads.map((l) => (
          <div
            key={l.name}
            className="flex items-center justify-between text-[12px] px-3 py-2 rounded-md bg-[var(--surface-hover)] border border-[rgba(255,255,255,0.05)]"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${l.ready ? "bg-[var(--primary-bright)]" : "bg-[var(--warning)]"}`}
              />
              <span className="text-[var(--text)]">{l.name}</span>
            </div>
            <div className="text-[var(--text)] font-semibold">{l.kw} kW</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WeatherCorrelationChart() {
  const regression = useMemo(() => {
    const n = weatherCorrelation.length;
    const sumX = weatherCorrelation.reduce((s, p) => s + p.oatC, 0);
    const sumY = weatherCorrelation.reduce((s, p) => s + p.dailyKwh, 0);
    const sumXY = weatherCorrelation.reduce((s, p) => s + p.oatC * p.dailyKwh, 0);
    const sumX2 = weatherCorrelation.reduce((s, p) => s + p.oatC * p.oatC, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = sumY / n - slope * (sumX / n);
    return { slope, intercept };
  }, []);

  const linePoints = [
    { x: 5, y: regression.slope * 5 + regression.intercept },
    { x: 26, y: regression.slope * 26 + regression.intercept },
  ];

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item" as const,
      formatter: (p: any) =>
        `${p.data.name ?? "Day"}<br/>OAT ${p.data.value[0]}°C<br/>Energy ${p.data.value[1]} kWh`,
    },
    grid: { left: 46, right: 12, top: 18, bottom: 30 },
    xAxis: {
      type: "value" as const,
      name: "Outdoor Temp (°C)",
      nameTextStyle: { color: "#6F8578", fontSize: 10 },
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
      min: 4,
      max: 27,
    },
    yAxis: {
      type: "value" as const,
      name: "Daily kWh",
      nameTextStyle: { color: "#6F8578", fontSize: 10 },
      axisLabel: {
        color: "#A7C4B5",
        fontSize: 10,
        formatter: (v: number) => `${(v / 1000).toFixed(1)}k`,
      },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
    },
    series: [
      {
        name: "Days",
        type: "scatter" as const,
        symbolSize: 8,
        itemStyle: {
          color: (p: any) => (p.data.isAnomaly ? "#e57373" : "#52b788"),
        },
        data: weatherCorrelation.map((p) => ({
          value: [p.oatC, p.dailyKwh],
          name: p.date,
          isAnomaly: p.isAnomaly,
        })),
      },
      {
        name: "Regression",
        type: "line",
        symbol: "none",
        lineStyle: { color: "#6cb2ff", width: 1.5 },
        data: linePoints.map((p) => [p.x, p.y]),
      },
    ],
  };

  return (
    <div className={`${CARD} p-4`}>
      <h4 className="text-[13px] font-semibold text-[var(--text)] mb-1">Weather Correlation</h4>
      <p className="text-[11px] text-[var(--text-faint)] mb-2">
        Outdoor temperature (KMA) vs daily energy — anomalies highlighted
      </p>
      <ReactECharts option={option} theme="octr" style={{ height: 220, width: "100%" }} notMerge />
    </div>
  );
}
