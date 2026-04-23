"use client";

import { zoneData, comfortHeatmapData } from "@/data/db3-data";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { octrTheme } from "@/lib/echarts-theme";

echarts.registerTheme("octr", octrTheme);

const CARD =
  "bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5";
const TITLE = "text-[15px] font-semibold text-[#e8f5e9]";
const BADGE =
  "text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]";

/* ── helpers ─────────────────────────────────────────────── */

function zoneColor(deviation: number): string {
  const abs = Math.abs(deviation);
  if (abs <= 1) return "#2d6a4f";
  if (abs <= 2) return "#40916c";
  if (abs <= 3) return "#f6c344";
  return "#e57373";
}

function outOfRange(temp: number): boolean {
  return temp < 20 || temp > 26;
}

function co2Color(ppm: number): string {
  if (ppm < 600) return "#e57373";
  if (ppm < 800) return "#f6c344";
  if (ppm <= 1000) return "#52b788";
  return "#f6c344";
}

/* ── pre-computed series data ────────────────────────────── */

const zoneNames = zoneData.map((z) => z.name);
const hours = Array.from({ length: 24 }, (_, i) => `${i}`);

const heatmapSeries = comfortHeatmapData.map((d) => [
  d.hour,
  zoneNames.indexOf(d.zone),
  d.deviation,
]);

/* ── chart options ───────────────────────────────────────── */

const deadBandOption = {
  tooltip: {
    trigger: "axis" as const,
    axisPointer: { type: "shadow" as const },
  },
  grid: { top: 8, bottom: 30, left: 130, right: 50 },
  xAxis: {
    type: "value" as const,
    max: 4,
    name: "°C",
    nameLocation: "end" as const,
    nameTextStyle: { color: "#6f8578", fontSize: 10 },
  },
  yAxis: {
    type: "category" as const,
    data: zoneNames,
    inverse: true,
    axisLabel: { fontSize: 10 },
  },
  series: [
    {
      type: "bar" as const,
      barWidth: 14,
      data: zoneData.map((z) => ({
        value: z.deadBandC,
        itemStyle: {
          color:
            z.deadBandC >= 2
              ? "#52b788"
              : z.deadBandC >= 1
                ? "#f6c344"
                : "#e57373",
          borderRadius: [0, 3, 3, 0],
        },
      })),
      markArea: {
        silent: true,
        itemStyle: { color: "rgba(82,183,136,0.06)" },
        data: [[{ xAxis: 2 }, { xAxis: 3 }]],
        label: {
          show: true,
          formatter: "Recommended",
          color: "#a7c4b5",
          fontSize: 10,
          position: "insideRight" as const,
        },
      },
    },
  ],
};

const huntingOption = {
  tooltip: {
    trigger: "axis" as const,
    axisPointer: { type: "shadow" as const },
  },
  grid: { top: 8, bottom: 30, left: 130, right: 50 },
  xAxis: {
    type: "value" as const,
    name: "crossings / hr",
    nameLocation: "end" as const,
    nameTextStyle: { color: "#6f8578", fontSize: 10 },
  },
  yAxis: {
    type: "category" as const,
    data: zoneNames,
    inverse: true,
    axisLabel: { fontSize: 10 },
  },
  series: [
    {
      type: "bar" as const,
      barWidth: 14,
      data: zoneData.map((z) => ({
        value: z.crossingsPerHour,
        itemStyle: {
          color:
            z.crossingsPerHour < 2
              ? "#52b788"
              : z.crossingsPerHour <= 4
                ? "#f6c344"
                : "#e57373",
          borderRadius: [0, 3, 3, 0],
        },
      })),
      markLine: {
        silent: true,
        symbol: "none",
        data: [{ xAxis: 4 }],
        lineStyle: { color: "#e57373", type: "dashed" as const, width: 1 },
        label: {
          formatter: "Threshold",
          position: "end" as const,
          color: "#e57373",
          fontSize: 10,
        },
      },
    },
  ],
};

const heatmapOption = {
  tooltip: {
    formatter: (p: { value: number[] }) => {
      const [hour, zoneIdx, deviation] = p.value;
      return `<b>${zoneNames[zoneIdx]}</b><br/>Hour ${hour}:00<br/>Deviation: ${deviation.toFixed(1)} °C`;
    },
  },
  grid: { top: 8, bottom: 60, left: 130, right: 20 },
  xAxis: {
    type: "category" as const,
    data: hours,
    splitArea: { show: true, areaStyle: { color: ["transparent", "rgba(255,255,255,0.01)"] } },
    axisLabel: { fontSize: 10 },
  },
  yAxis: {
    type: "category" as const,
    data: zoneNames,
    inverse: true,
    axisLabel: { fontSize: 10 },
  },
  visualMap: {
    min: 0,
    max: 5,
    calculable: true,
    orient: "horizontal" as const,
    left: "center",
    bottom: 0,
    inRange: {
      color: ["#1b4332", "#2d6a4f", "#52b788", "#f6c344", "#e57373"],
    },
    textStyle: { color: "#a7c4b5" },
  },
  series: [
    {
      type: "heatmap" as const,
      data: heatmapSeries,
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.5)" },
      },
    },
  ],
};

const co2Option = {
  tooltip: {
    trigger: "axis" as const,
    axisPointer: { type: "shadow" as const },
  },
  grid: { top: 8, bottom: 30, left: 130, right: 90 },
  xAxis: {
    type: "value" as const,
    max: 1400,
    name: "ppm",
    nameLocation: "end" as const,
    nameTextStyle: { color: "#6f8578", fontSize: 10 },
  },
  yAxis: {
    type: "category" as const,
    data: zoneNames,
    inverse: true,
    axisLabel: { fontSize: 10 },
  },
  series: [
    {
      type: "bar" as const,
      barWidth: 14,
      data: zoneData.map((z) => ({
        value: z.co2Ppm,
        itemStyle: {
          color: co2Color(z.co2Ppm),
          borderRadius: [0, 3, 3, 0],
        },
        label:
          z.co2Ppm < 600
            ? {
                show: true,
                formatter: "Over-ventilating",
                position: "right" as const,
                color: "#e57373",
                fontSize: 10,
              }
            : { show: false },
      })),
      markLine: {
        silent: true,
        symbol: "none",
        data: [
          {
            xAxis: 800,
            label: {
              formatter: "800",
              position: "end" as const,
              color: "#52b788",
              fontSize: 9,
            },
          },
          {
            xAxis: 1000,
            label: {
              formatter: "1000",
              position: "end" as const,
              color: "#52b788",
              fontSize: 9,
            },
          },
        ],
        lineStyle: { color: "#52b788", type: "dashed" as const, width: 1 },
      },
    },
  ],
};

/* ── page component ──────────────────────────────────────── */

export default function ZonesPage() {
  return (
    <div className="space-y-6">
      {/* ── Section 1: Floor Plan Canvas ────────────────── */}
      <div className={CARD}>
        <h2 className={TITLE}>Floor Plan — Zone Comfort Overview</h2>
        <div className="mt-4 bg-[#0a0f0d] rounded p-4">
          <svg
            viewBox="0 0 800 500"
            className="w-full h-auto"
            role="img"
            aria-label="Floor plan showing zone temperatures"
          >
            {/* floor backgrounds + labels */}
            {[3, 2, 1].map((floor, fi) => (
              <g key={floor}>
                <rect
                  x={95}
                  y={[25, 170, 315][fi]}
                  width={680}
                  height={125}
                  rx={8}
                  fill="rgba(255,255,255,0.02)"
                  stroke="rgba(255,255,255,0.04)"
                />
                <text
                  x={55}
                  y={[87, 232, 377][fi]}
                  fill="#a7c4b5"
                  fontSize="13"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  Floor {floor}
                </text>
              </g>
            ))}

            {/* zone rectangles */}
            {zoneData.map((z) => {
              const fill = zoneColor(z.deviation);
              const flagged = outOfRange(z.currentTemp);
              return (
                <g key={z.id}>
                  <rect
                    x={z.x}
                    y={z.y}
                    width={z.w}
                    height={z.h}
                    rx={6}
                    fill={fill}
                    opacity={0.85}
                    stroke={
                      flagged ? "#e57373" : "rgba(255,255,255,0.08)"
                    }
                    strokeWidth={flagged ? 2 : 1}
                    strokeDasharray={flagged ? "6 3" : "none"}
                  />
                  <text
                    x={z.x + z.w / 2}
                    y={z.y + z.h / 2 - 10}
                    fill="#fff"
                    fontSize="10"
                    fontWeight="500"
                    textAnchor="middle"
                  >
                    {z.name}
                  </text>
                  <text
                    x={z.x + z.w / 2}
                    y={z.y + z.h / 2 + 12}
                    fill="#fff"
                    fontSize="14"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {z.currentTemp}°C
                  </text>
                </g>
              );
            })}
          </svg>

          {/* legend */}
          <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-[#a7c4b5]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2d6a4f]" />
              ±1°C
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#40916c]" />
              1–2°C
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#f6c344]" />
              2–3°C
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#e57373]" />
              &gt;3°C
            </span>
            <span className="flex items-center gap-1.5 ml-2">
              <span className="w-3 h-3 rounded-sm border-2 border-dashed border-[#e57373]" />
              Outside 20–26°C
            </span>
          </div>
        </div>
      </div>

      {/* ── Section 2: Setpoint & Dead Band Analysis ──── */}
      <div className={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className={TITLE}>Setpoint &amp; Dead Band Analysis</h2>
          <span className={BADGE}>OEH Opp. 2</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <p className="text-[13px] text-[#a7c4b5] mb-1">
              Dead Band per Zone
            </p>
            <ReactECharts
              option={deadBandOption}
              theme="octr"
              style={{ height: 360 }}
            />
          </div>
          <div>
            <p className="text-[13px] text-[#a7c4b5] mb-1">
              Zone Hunting Detector
            </p>
            <ReactECharts
              option={huntingOption}
              theme="octr"
              style={{ height: 360 }}
            />
          </div>
        </div>

        <p className="text-[12px] text-[#6f8578] mt-3 italic">
          Each 1°C below 2°C dead band ≈ 10% more HVAC energy
        </p>
      </div>

      {/* ── Section 3: Comfort Intelligence ─────────────── */}
      <div className={CARD}>
        <h2 className={TITLE}>Comfort Intelligence</h2>
        <div className="mt-4">
          <ReactECharts
            option={heatmapOption}
            theme="octr"
            style={{ height: 350 }}
          />
        </div>
      </div>

      {/* ── Section 4: DCV ──────────────────────────────── */}
      <div className={CARD}>
        <div className="flex items-center gap-2 mb-4">
          <h2 className={TITLE}>
            CO₂ &amp; Demand Controlled Ventilation
          </h2>
          <span className={BADGE}>OEH Opp. 12</span>
        </div>

        <ReactECharts
          option={co2Option}
          theme="octr"
          style={{ height: 360 }}
        />

        <div className="mt-4 bg-[rgba(229,115,115,0.08)] border border-[rgba(229,115,115,0.15)] rounded-md p-3">
          <p className="text-[12px] text-[#e8f5e9]">
            <span className="text-[#e57373] font-semibold">Insight: </span>
            Zones with CO₂ &lt; 600 ppm + 100% OA damper = up to 20% wasted
            pre-conditioning energy
          </p>
        </div>
      </div>
    </div>
  );
}
