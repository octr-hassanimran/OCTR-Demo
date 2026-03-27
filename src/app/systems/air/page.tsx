"use client";

import { useState, useMemo } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import { octrTheme } from "@/lib/echarts-theme";
import { Check, AlertTriangle } from "lucide-react";
import {
  ahuOptions,
  ahuTimeline,
  temperatureData,
  dsprData,
  vavPositions,
  economyCycleData,
  economyHoursData,
  nightPurgeData,
  hwResetData,
} from "@/data/db3-data";

echarts.registerTheme("octr", octrTheme);

const STATE_KEYS = [
  "Fan Run",
  "Occupied",
  "Heating",
  "Cooling",
  "Economy",
  "Night Purge",
] as const;

const STATE_COLORS: Record<string, string> = {
  "Fan Run": "#6f8578",
  Occupied: "#52b788",
  Heating: "#f6c344",
  Cooling: "#6cb2ff",
  Economy: "#40916c",
  "Night Purge": "#9b59b6",
};

export default function AirSidePage() {
  const [selectedAhu, setSelectedAhu] = useState("ahu-03");

  const simHCCount = useMemo(
    () =>
      ahuTimeline.filter(
        (h) => h.states.includes("Heating") && h.states.includes("Cooling"),
      ).length,
    [],
  );

  const vavBuckets = useMemo(() => {
    const b = [0, 0, 0, 0];
    vavPositions.forEach((v) => {
      if (v.position < 25) b[0]++;
      else if (v.position < 50) b[1]++;
      else if (v.position < 75) b[2]++;
      else b[3]++;
    });
    return b;
  }, []);

  const economyAvailableRanges = useMemo(() => {
    const ranges: { xAxis: string }[][] = [];
    let start: string | null = null;
    economyCycleData.forEach((d, i) => {
      const ok = d.oaEnthalpy < d.raEnthalpy;
      if (ok && start === null) start = d.time;
      if ((!ok || i === economyCycleData.length - 1) && start !== null) {
        ranges.push([
          { xAxis: start },
          { xAxis: ok ? d.time : economyCycleData[i - 1].time },
        ]);
        start = null;
      }
    });
    return ranges;
  }, []);

  /* ── chart options ─────────────────────────────────────── */

  const tempOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: {
        data: ["SAT Actual", "SAT Setpoint", "RAT", "OAT"],
        bottom: 0,
      },
      grid: { left: 10, right: 20, top: 10, bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        data: temperatureData.map((d) => d.time),
        boundaryGap: false,
      },
      yAxis: { type: "value", axisLabel: { formatter: "{value}°C" } },
      series: [
        {
          name: "SAT Actual",
          type: "line",
          data: temperatureData.map((d) => d.satActual),
          lineStyle: { color: "#52b788", width: 2 },
          itemStyle: { color: "#52b788" },
        },
        {
          name: "SAT Setpoint",
          type: "line",
          data: temperatureData.map((d) => d.satSetpoint),
          lineStyle: { color: "#40916c", width: 1, type: "dashed" },
          itemStyle: { color: "#40916c" },
        },
        {
          name: "RAT",
          type: "line",
          data: temperatureData.map((d) => d.rat),
          lineStyle: { color: "#f6c344", width: 2 },
          itemStyle: { color: "#f6c344" },
        },
        {
          name: "OAT",
          type: "line",
          data: temperatureData.map((d) => d.oat),
          lineStyle: { color: "#6f8578", width: 1 },
          itemStyle: { color: "#6f8578" },
        },
      ],
    }),
    [],
  );

  const dsprLineOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { data: ["Actual", "Optimal Reset"], bottom: 0 },
      grid: { left: 10, right: 20, top: 10, bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        data: dsprData.map((d) => d.time),
        boundaryGap: false,
      },
      yAxis: { type: "value", axisLabel: { formatter: "{value} Pa" } },
      series: [
        {
          name: "Actual",
          type: "line",
          data: dsprData.map((d) => d.actual),
          lineStyle: { color: "#e57373", width: 2 },
          itemStyle: { color: "#e57373" },
        },
        {
          name: "Optimal Reset",
          type: "line",
          data: dsprData.map((d) => d.optimal),
          lineStyle: { color: "#52b788", width: 1, type: "dashed" },
          itemStyle: { color: "#52b788" },
        },
      ],
    }),
    [],
  );

  const vavBarOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      grid: { left: 10, right: 10, top: 10, bottom: 10, containLabel: true },
      xAxis: {
        type: "category",
        data: ["0-25%", "25-50%", "50-75%", "75-100%"],
      },
      yAxis: { type: "value", name: "VAV boxes" },
      series: [
        {
          type: "bar",
          data: vavBuckets.map((count, i) => ({
            value: count,
            itemStyle: { color: i < 2 ? "#f6c344" : "#52b788" },
          })),
        },
      ],
    }),
    [vavBuckets],
  );

  const economyCycleOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { data: ["OA Enthalpy", "RA Enthalpy"], bottom: 0 },
      grid: { left: 10, right: 20, top: 10, bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        data: economyCycleData.map((d) => d.time),
        boundaryGap: false,
      },
      yAxis: { type: "value", axisLabel: { formatter: "{value} kJ/kg" } },
      series: [
        {
          name: "OA Enthalpy",
          type: "line",
          data: economyCycleData.map((d) => d.oaEnthalpy),
          lineStyle: { color: "#6cb2ff", width: 2 },
          itemStyle: { color: "#6cb2ff" },
          markArea: {
            silent: true,
            itemStyle: { color: "rgba(82,183,136,0.08)" },
            data: economyAvailableRanges,
          },
        },
        {
          name: "RA Enthalpy",
          type: "line",
          data: economyCycleData.map((d) => d.raEnthalpy),
          lineStyle: { color: "#f6c344", width: 2 },
          itemStyle: { color: "#f6c344" },
          markLine: {
            silent: true,
            symbol: "none",
            data: [{ yAxis: 52 }],
            lineStyle: { color: "#e57373", type: "dashed", width: 1 },
            label: {
              formatter: "52 kJ/kg",
              position: "insideEndTop",
              color: "#e57373",
              fontSize: 10,
            },
          },
        },
      ],
    }),
    [economyAvailableRanges],
  );

  const economyHoursOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { data: ["Available", "Active"], bottom: 0 },
      grid: { left: 10, right: 10, top: 10, bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        data: economyHoursData.map((d) => d.day),
      },
      yAxis: { type: "value", name: "Hours" },
      series: [
        {
          name: "Available",
          type: "bar",
          data: economyHoursData.map((d) => d.available),
          itemStyle: { color: "#40916c" },
        },
        {
          name: "Active",
          type: "bar",
          data: economyHoursData.map((d) => d.active),
          itemStyle: { color: "#52b788" },
        },
      ],
    }),
    [],
  );

  const hwResetOption = useMemo(
    () => ({
      tooltip: { trigger: "axis" },
      legend: { data: ["Actual HW Temp", "Optimal Reset"], bottom: 0 },
      grid: { left: 10, right: 20, top: 10, bottom: 40, containLabel: true },
      xAxis: {
        type: "category",
        data: hwResetData.map((d) => d.month),
      },
      yAxis: {
        type: "value",
        min: 40,
        axisLabel: { formatter: "{value}°C" },
      },
      series: [
        {
          name: "Actual HW Temp",
          type: "line",
          data: hwResetData.map((d) => d.actual),
          lineStyle: { color: "#f6c344", width: 2 },
          itemStyle: { color: "#f6c344" },
        },
        {
          name: "Optimal Reset",
          type: "line",
          data: hwResetData.map((d) => d.optimal),
          lineStyle: { color: "#52b788", width: 1, type: "dashed" },
          itemStyle: { color: "#52b788" },
        },
      ],
    }),
    [],
  );

  /* ── lockout criteria ──────────────────────────────────── */

  const lockouts = [
    { label: "Temp > 20°C?", value: "24°C", locked: true },
    { label: "Enthalpy > 52 kJ/kg?", value: "48 kJ/kg", locked: false },
    { label: "Dew point > 12°C?", value: "14°C", locked: true },
  ];

  /* ── render ────────────────────────────────────────────── */

  return (
    <div className="space-y-6">
      {/* AHU Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)" }}
          >
            AHU performance, duct pressure, economy cycle, and air-side
            optimization
          </p>
        </div>
        <select
          value={selectedAhu}
          onChange={(e) => setSelectedAhu(e.target.value)}
          className="bg-[#1a2b22] border border-[rgba(255,255,255,0.14)] text-[#e8f5e9] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#52b788]"
        >
          {ahuOptions.map((o) => (
            <option key={o.id} value={o.id} className="bg-[#111b16]">
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {/* ── Panel 1: State Timeline ────────────────────── */}
        <section className="bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#e8f5e9]">
              Operating State Timeline — 24H
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]">
              OEH Opp. 3
            </span>
          </div>

          {/* legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
            {STATE_KEYS.map((s) => (
              <div key={s} className="flex items-center gap-1.5">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: STATE_COLORS[s] }}
                />
                <span className="text-[11px] text-[#a7c4b5]">{s}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-[#e57373]/30 border border-[#e57373]/50" />
              <span className="text-[11px] text-[#e57373]">Sim. H+C</span>
            </div>
          </div>

          {/* timeline grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="flex">
                <div className="w-20 shrink-0 flex flex-col">
                  {STATE_KEYS.map((s) => (
                    <div key={s} className="h-6 flex items-center">
                      <span className="text-[11px] text-[#a7c4b5] truncate">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex-1 flex gap-px">
                  {ahuTimeline.map((h) => {
                    const isSimHC =
                      h.states.includes("Heating") &&
                      h.states.includes("Cooling");
                    return (
                      <div key={h.hour} className="flex-1 relative">
                        {STATE_KEYS.map((s) => (
                          <div
                            key={s}
                            className="h-6"
                            style={{
                              backgroundColor: h.states.includes(s)
                                ? STATE_COLORS[s]
                                : "rgba(255,255,255,0.03)",
                            }}
                          />
                        ))}
                        {isSimHC && (
                          <div
                            className="absolute inset-0 flex items-end justify-center pb-0.5 pointer-events-none"
                            style={{
                              backgroundColor: "rgba(229,115,115,0.3)",
                            }}
                          >
                            <span
                              className="text-[7px] font-bold uppercase leading-none"
                              style={{ color: "#e57373" }}
                            >
                              WASTE
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex">
                <div className="w-20 shrink-0" />
                <div className="flex-1 flex">
                  {ahuTimeline.map((h) => (
                    <div
                      key={h.hour}
                      className="flex-1 text-center text-[9px] text-[#6f8578] pt-1"
                    >
                      {h.hour}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-3 text-[12px] text-[#f6c344] flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Simultaneous H+C: {simHCCount} hours detected — est. 280 kWh/day
            waste
          </p>
        </section>

        {/* ── Panel 2: Temperature Analysis ──────────────── */}
        <section className="bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#e8f5e9]">
              Temperature Analysis
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]">
              OEH Opp. 3
            </span>
          </div>
          <ReactECharts
            option={tempOption}
            theme="octr"
            style={{ height: 300 }}
          />
          <p className="mt-3 text-[12px] text-[#f6c344] flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            SAT reset DISABLED — flat setpoint detected
          </p>
        </section>

        {/* ── Panel 3: DSPR ──────────────────────────────── */}
        <section className="bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#e8f5e9]">
              Duct Static Pressure Reset
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]">
              OEH Opp. 5
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <ReactECharts
                option={dsprLineOption}
                theme="octr"
                style={{ height: 250 }}
              />
              <p className="mt-2 text-[12px] text-[#f6c344] flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                Fixed setpoint = fan over-running
              </p>
            </div>
            <div>
              <ReactECharts
                option={vavBarOption}
                theme="octr"
                style={{ height: 250 }}
              />
              <p className="mt-2 text-[12px] text-[#f6c344]">
                Most VAVs &lt; 50% open → pressure too high
              </p>
            </div>
          </div>
          <div className="mt-4 bg-[rgba(108,178,255,0.08)] border border-[rgba(108,178,255,0.15)] rounded-md px-4 py-2.5 text-[12px] text-[#6cb2ff]">
            −20% fan speed = −49% fan power (fan affinity law)
          </div>
        </section>

        {/* ── Panel 4: Economy Cycle ─────────────────────── */}
        <section className="bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#e8f5e9]">
              Economy Cycle Performance
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]">
              OEH Opp. 10
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ReactECharts
              option={economyCycleOption}
              theme="octr"
              style={{ height: 280 }}
            />
            <ReactECharts
              option={economyHoursOption}
              theme="octr"
              style={{ height: 280 }}
            />
          </div>

          {/* lockout criteria */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            {lockouts.map((l) => (
              <div
                key={l.label}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-md p-3"
              >
                <div className="text-[11px] text-[#a7c4b5] mb-1">
                  {l.label}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#e8f5e9]">
                    {l.value}
                  </span>
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: l.locked
                        ? "rgba(229,115,115,0.2)"
                        : "rgba(82,183,136,0.2)",
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: l.locked ? "#e57373" : "#52b788",
                      }}
                    />
                  </span>
                </div>
                <div
                  className="text-[10px] mt-1"
                  style={{ color: l.locked ? "#e57373" : "#52b788" }}
                >
                  {l.locked ? "Locked out" : "OK"}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Panel 5: Night Purge ───────────────────────── */}
        <section className="bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#e8f5e9]">
              Night Purge
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]">
              OEH Opp. 11
            </span>
          </div>

          {/* condition tiles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-md p-3">
              <div className="text-[11px] text-[#a7c4b5] mb-1">
                Space &gt; 25°C
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#e8f5e9]">
                  {nightPurgeData.spaceTemp}°C
                </span>
                <div className="w-5 h-5 rounded-full bg-[rgba(82,183,136,0.2)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#52b788]" />
                </div>
              </div>
              <div className="text-[10px] text-[#52b788] mt-1">
                Condition met
              </div>
            </div>

            <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-md p-3">
              <div className="text-[11px] text-[#a7c4b5] mb-1">
                OA ≥ 5°C cooler
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#e8f5e9]">
                  Δ
                  {(nightPurgeData.spaceTemp - nightPurgeData.oaTemp).toFixed(1)}
                  °C
                </span>
                <div className="w-5 h-5 rounded-full bg-[rgba(82,183,136,0.2)] flex items-center justify-center">
                  <Check className="w-3 h-3 text-[#52b788]" />
                </div>
              </div>
              <div className="text-[10px] text-[#52b788] mt-1">
                OA {nightPurgeData.oaTemp}°C · Space{" "}
                {nightPurgeData.spaceTemp}°C
              </div>
            </div>
          </div>

          {/* alert */}
          <div className="bg-[rgba(229,115,115,0.1)] border border-[rgba(229,115,115,0.25)] rounded-md px-4 py-3 mb-5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#e57373] shrink-0" />
            <span className="text-[13px] text-[#e57373] font-medium">
              Conditions MET but Night Purge NOT activated
            </span>
          </div>

          {/* comparison bars */}
          <div className="space-y-4">
            <ComparisonBar
              label="Pre-occupancy Temperature"
              withVal={nightPurgeData.comparison.withPurge.preOccupancyTemp}
              withoutVal={
                nightPurgeData.comparison.withoutPurge.preOccupancyTemp
              }
              max={30}
              unit="°C"
            />
            <ComparisonBar
              label="Startup Energy"
              withVal={nightPurgeData.comparison.withPurge.startupEnergy}
              withoutVal={nightPurgeData.comparison.withoutPurge.startupEnergy}
              max={160}
              unit="kWh"
            />
          </div>
        </section>

        {/* ── Panel 6: HW Reset ──────────────────────────── */}
        <section className="bg-[#111b16] border border-[rgba(255,255,255,0.06)] rounded-md p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[15px] font-semibold text-[#e8f5e9]">
              Hot Water Reset
            </h3>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[rgba(82,183,136,0.15)] text-[#52b788]">
              OEH Opp. 6
            </span>
          </div>
          <ReactECharts
            option={hwResetOption}
            theme="octr"
            style={{ height: 280 }}
          />
          <p className="mt-3 text-[12px] text-[#f6c344] flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            Fixed HW temp = boiler inefficiency during mild weather
          </p>
        </section>
      </div>
    </div>
  );
}

/* ── helper component ──────────────────────────────────── */

function ComparisonBar({
  label,
  withVal,
  withoutVal,
  max,
  unit,
}: {
  label: string;
  withVal: number;
  withoutVal: number;
  max: number;
  unit: string;
}) {
  return (
    <div>
      <div className="text-[12px] text-[#a7c4b5] mb-2">{label}</div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#a7c4b5] w-32 shrink-0">
            With Night Purge
          </span>
          <div className="flex-1 h-5 bg-[rgba(255,255,255,0.03)] rounded overflow-hidden">
            <div
              className="h-full rounded"
              style={{
                width: `${(withVal / max) * 100}%`,
                backgroundColor: "#52b788",
              }}
            />
          </div>
          <span className="text-[12px] text-[#52b788] w-16 text-right shrink-0">
            {withVal} {unit}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#a7c4b5] w-32 shrink-0">
            Without
          </span>
          <div className="flex-1 h-5 bg-[rgba(255,255,255,0.03)] rounded overflow-hidden">
            <div
              className="h-full rounded"
              style={{
                width: `${(withoutVal / max) * 100}%`,
                backgroundColor: "#e57373",
              }}
            />
          </div>
          <span className="text-[12px] text-[#e57373] w-16 text-right shrink-0">
            {withoutVal} {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
