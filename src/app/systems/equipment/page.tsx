"use client";

import {
  equipmentData,
  eevTxvData,
  degradationTrends,
  bmsChanges,
} from "@/data/db3-data";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { octrTheme } from "@/lib/echarts-theme";

echarts.registerTheme("octr", octrTheme);

const CARD =
  "bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5";
const TITLE = "text-[15px] font-semibold text-[#e8f5e9]";
const BADGE =
  "text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]";

const TYPE_ICON: Record<string, string> = {
  chiller: "❄️",
  ahu: "💨",
  pump: "⚙️",
  tower: "🗼",
};

/* ── inline helper components ───────────────────────────── */

function HealthGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "#52b788" : score >= 60 ? "#f6c344" : "#e57373";
  const r = 16;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;

  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="3"
      />
      <circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={`${dash} ${c}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
      />
      <text
        x="20"
        y="20"
        textAnchor="middle"
        dominantBaseline="central"
        fill={color}
        fontSize="10"
        fontWeight="600"
      >
        {score}
      </text>
    </svg>
  );
}

function MiniSparkline({
  data,
  color = "#52b788",
}: {
  data: number[];
  color?: string;
}) {
  if (data.length < 2) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = 20;
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 4) - 2}`,
    )
    .join(" ");

  return (
    <svg
      width={w}
      height={h}
      className="inline-block align-middle ml-1"
    >
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

function StatusBadge({
  status,
}: {
  status: "on_track" | "due_soon" | "overdue";
}) {
  const cfg = {
    on_track: {
      bg: "rgba(82,183,136,0.15)",
      text: "#52b788",
      label: "ON TRACK",
    },
    due_soon: {
      bg: "rgba(246,195,68,0.15)",
      text: "#f6c344",
      label: "DUE SOON",
    },
    overdue: {
      bg: "rgba(229,115,115,0.15)",
      text: "#e57373",
      label: "OVERDUE",
    },
  }[status];

  return (
    <span
      className="text-[11px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap"
      style={{ backgroundColor: cfg.bg, color: cfg.text }}
    >
      {cfg.label}
    </span>
  );
}

function categoryStyle(cat: string) {
  switch (cat) {
    case "Strategy":
      return { bg: "rgba(229,115,115,0.15)", color: "#e57373" };
    case "Setpoint":
      return { bg: "rgba(246,195,68,0.15)", color: "#f6c344" };
    default:
      return { bg: "rgba(82,183,136,0.15)", color: "#52b788" };
  }
}

/* ── EEV vs TXV chart ────────────────────────────────────── */

const eevTxvOption = {
  tooltip: {
    trigger: "axis" as const,
    axisPointer: { type: "shadow" as const },
  },
  grid: { top: 8, bottom: 30, left: 110, right: 50 },
  xAxis: {
    type: "value" as const,
    max: 10,
    name: "Superheat °C",
    nameLocation: "end" as const,
    nameTextStyle: { color: "#6f8578", fontSize: 10 },
  },
  yAxis: {
    type: "category" as const,
    data: eevTxvData.map((d) => d.circuit),
    inverse: true,
    axisLabel: { fontSize: 10 },
  },
  series: [
    {
      type: "bar" as const,
      barWidth: 16,
      data: eevTxvData.map((d) => ({
        value: d.superheatC,
        itemStyle: {
          color: d.type === "EEV" ? "#52b788" : "#f6c344",
          borderRadius: [0, 3, 3, 0],
        },
      })),
      markArea: {
        silent: true,
        data: [
          [
            { xAxis: 2, itemStyle: { color: "rgba(82,183,136,0.06)" } },
            { xAxis: 3 },
          ],
          [
            { xAxis: 5, itemStyle: { color: "rgba(246,195,68,0.06)" } },
            { xAxis: 7 },
          ],
        ],
      },
    },
  ],
};

/* ── degradation trend helpers ───────────────────────────── */

const months = degradationTrends.map((d) => d.month);

function trendOption(data: number[], color: string) {
  return {
    grid: { top: 8, bottom: 24, left: 40, right: 8 },
    xAxis: {
      type: "category" as const,
      data: months,
      axisLabel: { fontSize: 10, color: "#6f8578" },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
    },
    yAxis: {
      type: "value" as const,
      axisLabel: { fontSize: 10, color: "#6f8578" },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
    },
    series: [
      {
        type: "line" as const,
        data,
        smooth: true,
        symbol: "circle",
        symbolSize: 5,
        lineStyle: { color, width: 2 },
        itemStyle: { color },
        areaStyle: { color: `${color}18` },
      },
    ],
  };
}

const ctOption = trendOption(
  degradationTrends.map((d) => d.coolingTowerApproach),
  "#f6c344",
);
const copOption = trendOption(
  degradationTrends.map((d) => d.chillerCOP),
  "#52b788",
);
const filterOption = trendOption(
  degradationTrends.map((d) => d.filterDP),
  "#e57373",
);

const disabledCount = bmsChanges.filter(
  (c) =>
    c.category === "Strategy" &&
    c.change.toLowerCase().includes("disabled"),
).length;

const latestTrend = degradationTrends[degradationTrends.length - 1];

/* ── page component ──────────────────────────────────────── */

export default function EquipmentPage() {
  return (
    <div className="space-y-6">
      {/* ── Section 1: Equipment Health Scorecard ────── */}
      <div className={CARD}>
        <h2 className={TITLE}>Equipment Health Scorecard</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr>
                {[
                  "Equipment",
                  "Runtime Hours",
                  "Start / Stop",
                  "Efficiency",
                  "Health",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] tracking-wider uppercase text-[#a7c4b5] pb-3 px-3 sticky top-0 bg-[#111b16]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {equipmentData.map((eq) => {
                const pct = Math.min(
                  100,
                  (eq.runtimeHours / eq.recommendedInterval) * 100,
                );
                const barColor =
                  pct > 90
                    ? "#e57373"
                    : pct > 75
                      ? "#f6c344"
                      : "#52b788";

                return (
                  <tr
                    key={eq.id}
                    className="hover:bg-[rgba(82,183,136,0.06)] transition-colors"
                  >
                    {/* name */}
                    <td className="text-[13px] px-3 py-3 border-b border-white/[0.04] whitespace-nowrap">
                      <span className="mr-1.5">
                        {TYPE_ICON[eq.type]}
                      </span>
                      {eq.name}
                    </td>

                    {/* runtime */}
                    <td className="text-[13px] px-3 py-3 border-b border-white/[0.04]">
                      <span className="text-[#e8f5e9]">
                        {eq.runtimeHours.toLocaleString()} /{" "}
                        {eq.recommendedInterval.toLocaleString()} hrs
                      </span>
                      <div className="w-20 h-1.5 bg-white/[0.08] rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: barColor,
                          }}
                        />
                      </div>
                    </td>

                    {/* start/stop */}
                    <td className="text-[13px] px-3 py-3 border-b border-white/[0.04]">
                      <span
                        style={{
                          color:
                            eq.startStopCycles > 500
                              ? "#e57373"
                              : "#e8f5e9",
                        }}
                      >
                        {eq.startStopCycles}
                      </span>
                    </td>

                    {/* efficiency */}
                    <td className="text-[13px] px-3 py-3 border-b border-white/[0.04]">
                      <span className="text-[#e8f5e9]">
                        {eq.efficiencyPct}%
                      </span>
                      <MiniSparkline data={eq.sparkline} />
                    </td>

                    {/* health gauge */}
                    <td className="px-3 py-3 border-b border-white/[0.04]">
                      <HealthGauge score={eq.healthScore} />
                    </td>

                    {/* status */}
                    <td className="px-3 py-3 border-b border-white/[0.04]">
                      <StatusBadge status={eq.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 2: EEV vs TXV Monitor ───────────── */}
      <div className={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className={TITLE}>
            EEV vs TXV Superheat Comparison
          </h2>
          <span className={BADGE}>OEH Opp. 9</span>
        </div>

        {/* inline legend */}
        <div className="flex items-center gap-4 mb-2">
          <span className="flex items-center gap-1.5 text-[12px] text-[#a7c4b5]">
            <span className="w-3 h-3 rounded-sm bg-[#52b788]" />
            EEV (target 2–3°C)
          </span>
          <span className="flex items-center gap-1.5 text-[12px] text-[#a7c4b5]">
            <span className="w-3 h-3 rounded-sm bg-[#f6c344]" />
            TXV (range 5–7°C)
          </span>
        </div>

        <ReactECharts
          option={eevTxvOption}
          theme="octr"
          style={{ height: 260 }}
        />

        <p className="text-[12px] text-[#6f8578] mt-3 italic">
          TXV circuits: Est. 15% compressor saving potential if retrofitted
          to EEV
        </p>
      </div>

      {/* ── Section 3: Degradation Trend Indicators ─── */}
      <div className={CARD}>
        <h2 className={TITLE}>Degradation Trend Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4">
          {/* Cooling Tower Approach */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] text-[#a7c4b5]">
                Cooling Tower Approach
              </p>
              <span className="text-[14px] font-semibold text-[#f6c344]">
                {latestTrend.coolingTowerApproach}°C
                <span className="text-[#e57373] ml-1">↑</span>
              </span>
            </div>
            <ReactECharts
              option={ctOption}
              theme="octr"
              style={{ height: 160 }}
            />
          </div>

          {/* Chiller COP */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] text-[#a7c4b5]">Chiller COP</p>
              <span className="text-[14px] font-semibold text-[#52b788]">
                {latestTrend.chillerCOP}
                <span className="text-[#e57373] ml-1">↓</span>
              </span>
            </div>
            <ReactECharts
              option={copOption}
              theme="octr"
              style={{ height: 160 }}
            />
          </div>

          {/* AHU Filter ΔP */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[13px] text-[#a7c4b5]">AHU Filter ΔP</p>
              <span className="text-[14px] font-semibold text-[#e57373]">
                {latestTrend.filterDP} Pa
                <span className="text-[#e57373] ml-1">↑</span>
              </span>
            </div>
            <ReactECharts
              option={filterOption}
              theme="octr"
              style={{ height: 160 }}
            />
          </div>
        </div>
      </div>

      {/* ── Section 4: BMS Software Audit ───────────── */}
      <div className={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className={TITLE}>
            BMS Software &amp; Controls Audit
          </h2>
          <span className={BADGE}>OEH Opp. 20</span>
        </div>

        {/* alert */}
        {disabledCount > 0 && (
          <div className="bg-[rgba(229,115,115,0.1)] border border-[rgba(229,115,115,0.25)] rounded-md p-3 mb-4">
            <p className="text-[13px] text-[#e57373] font-semibold">
              ⚠ {disabledCount} OEH strategies disabled in last 30 days
            </p>
          </div>
        )}

        {/* change log */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px]">
            <thead>
              <tr>
                {["Timestamp", "User", "Change", "Category"].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] tracking-wider uppercase text-[#a7c4b5] pb-3 px-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bmsChanges.map((c, i) => {
                const cs = categoryStyle(c.category);
                return (
                  <tr
                    key={i}
                    className="hover:bg-[rgba(82,183,136,0.06)] transition-colors"
                  >
                    <td className="text-[12px] text-[#6f8578] px-3 py-2.5 border-b border-white/[0.04] whitespace-nowrap">
                      {c.timestamp}
                    </td>
                    <td className="text-[13px] text-[#e8f5e9] px-3 py-2.5 border-b border-white/[0.04]">
                      {c.user}
                    </td>
                    <td className="text-[13px] text-[#e8f5e9] px-3 py-2.5 border-b border-white/[0.04]">
                      {c.change}
                    </td>
                    <td className="text-[13px] px-3 py-2.5 border-b border-white/[0.04]">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: cs.bg,
                          color: cs.color,
                        }}
                      >
                        {c.category}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* OSS Learning Health */}
        <div className="mt-4 bg-[rgba(82,183,136,0.06)] border border-[rgba(82,183,136,0.12)] rounded-md p-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#52b788] animate-pulse" />
            <span className="text-[13px] text-[#e8f5e9]">
              Adaptive algorithm: <strong>Active</strong>
            </span>
          </div>
          <span className="text-[12px] text-[#6f8578]">
            Last calculation: 2 hours ago
          </span>
        </div>
      </div>
    </div>
  );
}
