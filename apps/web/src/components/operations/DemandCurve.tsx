"use client";

import dynamic from "next/dynamic";
import { Zap } from "lucide-react";
import { demandCurveData, demandMeta } from "@/data/operations";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="h-[340px] rounded-md bg-[var(--surface)] animate-pulse" />
  ),
});

export function DemandCurve() {
  const times = demandCurveData.map((d) => d.time);
  const todayVals = demandCurveData.map((d) => d.todayKw);
  const yesterdayVals = demandCurveData.map((d) => d.yesterdayKw);
  const avgVals = demandCurveData.map((d) => d.avg7dKw);

  const peakPct = Math.round(
    (demandMeta.monthPeakKw / demandMeta.contractLimitKw) * 100
  );
  const peakColor = peakPct >= 95 ? "#e57373" : peakPct >= 85 ? "#f6c344" : "#52b788";

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis" as const,
      backgroundColor: "rgba(17,27,22,0.95)",
      borderColor: "rgba(255,255,255,0.08)",
      borderWidth: 1,
      textStyle: { color: "#E8F5E9", fontSize: 12 },
      axisPointer: {
        type: "cross" as const,
        lineStyle: { color: "rgba(82,183,136,0.3)" },
        crossStyle: { color: "rgba(82,183,136,0.3)" },
      },
    },
    legend: {
      data: ["Today", "Yesterday", "7-Day Avg"],
      textStyle: { color: "#A7C4B5", fontSize: 11 },
      top: 4,
      right: 0,
      itemWidth: 16,
      itemHeight: 2,
    },
    grid: { left: 48, right: 16, top: 36, bottom: 28, containLabel: false },
    xAxis: {
      type: "category" as const,
      data: times,
      axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
      axisLabel: {
        color: "#A7C4B5",
        fontSize: 10,
        interval: 5,
      },
      axisTick: { show: false },
    },
    yAxis: {
      type: "value" as const,
      name: "kW",
      nameTextStyle: { color: "#6F8578", fontSize: 10, padding: [0, 30, 0, 0] },
      axisLine: { show: false },
      axisLabel: { color: "#A7C4B5", fontSize: 10 },
      splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
    },
    series: [
      {
        name: "Today",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: todayVals,
        lineStyle: { color: "#52B788", width: 2.5 },
        itemStyle: { color: "#52B788" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(82,183,136,0.35)" },
              { offset: 1, color: "rgba(82,183,136,0.02)" },
            ],
          },
        },
        markArea: {
          silent: true,
          data: [
            ...demandMeta.peakTariffWindows.map((w) => [
              {
                xAxis: w.start,
                itemStyle: { color: "rgba(246,195,68,0.05)" },
              },
              { xAxis: w.end },
            ]),
            [
              {
                xAxis: demandMeta.ossStartWindow.start,
                itemStyle: { color: "rgba(108,178,255,0.06)" },
                label: {
                  show: true,
                  position: "insideTop" as const,
                  formatter: "OSS Window",
                  color: "#6CB2FF",
                  fontSize: 9,
                  fontWeight: 600,
                },
              },
              { xAxis: demandMeta.ossStartWindow.end },
            ],
          ],
        },
      },
      {
        name: "Yesterday",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: yesterdayVals,
        lineStyle: { color: "#2D6A4F", width: 1.5, type: "dashed" as const },
        itemStyle: { color: "#2D6A4F" },
      },
      {
        name: "7-Day Avg",
        type: "line",
        smooth: 0.4,
        symbol: "none",
        data: avgVals,
        lineStyle: { color: "#40916C", width: 1 },
        itemStyle: { color: "#40916C" },
        areaStyle: { color: "rgba(45,106,79,0.08)" },
      },
    ],
  };

  return (
    <div className="rounded-md bg-[var(--surface)] shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_4px_20px_rgba(0,0,0,0.25)] overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-1">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          24-Hour Demand Curve
        </h3>
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
          style={{
            borderColor: `${peakColor}33`,
            backgroundColor: `${peakColor}10`,
          }}
        >
          <Zap className="w-3 h-3" style={{ color: peakColor }} />
          <span className="text-[11px] font-semibold" style={{ color: peakColor }}>
            Peak: {demandMeta.monthPeakKw} kW / {demandMeta.contractLimitKw} kW
            limit ({peakPct}%)
          </span>
        </div>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 320, width: "100%" }}
        notMerge
      />
    </div>
  );
}
