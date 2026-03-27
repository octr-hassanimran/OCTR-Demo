"use client";

import dynamic from "next/dynamic";
import {
  alertHeatmapData,
  alertHeatmapTooltips,
  heatmapDays,
  heatmapDDCLabels,
  ddcStatuses,
} from "@/data/operations";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] rounded-md bg-[var(--surface)] animate-pulse" />
  ),
});

export function AlertHeatmap() {
  const ddcNames = ddcStatuses.map((d) => `${d.id} ${d.name}`);

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      position: "top" as const,
      backgroundColor: "rgba(17,27,22,0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: { color: "#E8F5E9", fontSize: 12 },
      formatter: (params: { data: number[] }) => {
        const [dayIdx, ddcIdx, count] = params.data;
        const ddcName = ddcNames[ddcIdx] || "";
        const day = heatmapDays[dayIdx] || "";
        const tooltipKey = `${dayIdx}-${ddcIdx}`;
        const topFault = alertHeatmapTooltips[tooltipKey];
        return `
          <div style="min-width:140px">
            <div style="font-weight:600;margin-bottom:4px">${ddcName}</div>
            <div style="color:#A7C4B5">${day}: ${count} alert${count !== 1 ? "s" : ""}</div>
            ${topFault ? `<div style="color:#A7C4B5;margin-top:2px;font-size:11px">Top: ${topFault}</div>` : ""}
          </div>
        `;
      },
    },
    grid: {
      left: 140,
      right: 20,
      top: 8,
      bottom: 52,
    },
    xAxis: {
      type: "category" as const,
      data: heatmapDays,
      splitArea: { show: false },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      axisLabel: { color: "#A7C4B5", fontSize: 11 },
      axisTick: { show: false },
    },
    yAxis: {
      type: "category" as const,
      data: heatmapDDCLabels,
      splitArea: { show: false },
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } },
      axisLabel: {
        color: "#A7C4B5",
        fontSize: 10,
        formatter: (val: string) => {
          const ddc = ddcStatuses.find((d) => d.id === val);
          return ddc ? `${val}  ${ddc.name}` : val;
        },
      },
      axisTick: { show: false },
    },
    visualMap: {
      min: 0,
      max: 10,
      calculable: false,
      orient: "horizontal" as const,
      left: "center",
      bottom: 2,
      itemWidth: 14,
      itemHeight: 120,
      textStyle: { color: "#A7C4B5", fontSize: 10 },
      inRange: {
        color: [
          "#111b16",
          "#1b4332",
          "#2d6a4f",
          "#52b788",
          "#f6c344",
          "#e57373",
        ],
      },
    },
    series: [
      {
        type: "heatmap",
        data: alertHeatmapData,
        label: {
          show: true,
          color: "#e8f5e9",
          fontSize: 10,
          fontWeight: 500,
          formatter: (params: { data: number[] }) =>
            params.data[2] > 0 ? String(params.data[2]) : "",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: "rgba(0,0,0,0.5)",
          },
        },
        itemStyle: {
          borderColor: "#0a0f0d",
          borderWidth: 3,
          borderRadius: 3,
        },
      },
    ],
  };

  return (
    <div className="rounded-md bg-[var(--surface)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="px-5 pt-4 pb-1">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          Alert Severity Heatmap
        </h3>
        <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
          Alerts per controller per day — reveals chronic vs. one-off problems
        </p>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 360, width: "100%" }}
        notMerge
      />
    </div>
  );
}
