"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

const monthlyEnergy = [
  { month: "Jan", baselineKwh: 125000, actualKwh: 110000, events: [{ label: "Optimization ON" }] },
  { month: "Feb", baselineKwh: 118000, actualKwh: 104000, events: [] },
  { month: "Mar", baselineKwh: 122000, actualKwh: 100000, events: [{ label: "Fault detected" }] },
  { month: "Apr", baselineKwh: 120000, actualKwh: 98000, events: [] },
  { month: "May", baselineKwh: 118000, actualKwh: 96000, events: [] },
  { month: "Jun", baselineKwh: 124000, actualKwh: 99000, events: [{ label: "Chiller tuning" }] },
  { month: "Jul", baselineKwh: 130000, actualKwh: 112000, events: [] },
  { month: "Aug", baselineKwh: 128000, actualKwh: 118000, events: [] },
  { month: "Sep", baselineKwh: 123000, actualKwh: 102000, events: [] },
  { month: "Oct", baselineKwh: 118000, actualKwh: 95000, events: [] },
  { month: "Nov", baselineKwh: 115000, actualKwh: 92000, events: [] },
  { month: "Dec", baselineKwh: 120000, actualKwh: 97000, events: [] },
];

const chartData = monthlyEnergy.map((d) => ({
  ...d,
  saving: d.baselineKwh - d.actualKwh,
}));

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  const baseline = payload.find((p: any) => p.dataKey === "baselineKwh");
  const actual = payload.find((p: any) => p.dataKey === "actualKwh");
  if (!baseline || !actual) return null;
  const delta = baseline.value - actual.value;
  const pct = ((delta / baseline.value) * 100).toFixed(1);
  const entry = monthlyEnergy.find((d) => d.month === label);

  return (
    <div className="bg-[rgba(17,27,22,0.95)] border border-white/[0.08] rounded-md px-3 py-2.5 shadow-lg text-xs">
      <div className="text-[var(--text)] font-semibold mb-1.5">{label} 2025</div>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-sm bg-[var(--primary)]" />
        <span className="text-[var(--text-muted)]">Baseline:</span>
        <span className="text-[var(--text)] font-medium ml-auto">
          {(baseline.value / 1000).toFixed(0)}K kWh
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-sm bg-[var(--primary-bright)]" />
        <span className="text-[var(--text-muted)]">Actual:</span>
        <span className="text-[var(--text)] font-medium ml-auto">
          {(actual.value / 1000).toFixed(0)}K kWh
        </span>
      </div>
      <div className="border-top border-white/[0.06] mt-1.5 pt-1.5">
        <span className={delta > 0 ? "text-[var(--primary-bright)]" : "text-[var(--danger)]"}>
          {delta > 0 ? "Saving" : "Over-baseline"}: {Math.abs(delta / 1000).toFixed(0)}K kWh (
          {delta > 0 ? "−" : "+"}
          {Math.abs(Number(pct))}%)
        </span>
      </div>
      {entry?.events.map((ev, i) => (
        <div key={i} className="mt-1 text-[10px] text-[var(--info)]">
          ⚡ {ev.label}
        </div>
      ))}
    </div>
  );
}

export function EnergyComparisonChart() {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Expected vs Actual Energy</h3>
          <p className="text-[11px] text-[var(--text-faint)] mt-0.5">
            12-month comparison — green shading = savings, red = over-baseline
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]" />
            <span className="text-[var(--text-muted)]">Baseline</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--primary-bright)]" />
            <span className="text-[var(--text-muted)]">Actual</span>
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barCategoryGap="20%" barGap={2}>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
            tickLine={false}
            tick={{ fill: "#a7c4b5", fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#a7c4b5", fontSize: 11 }}
            tickFormatter={(v) => `${v / 1000}K`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
          <Bar dataKey="baselineKwh" radius={[3, 3, 0, 0]} fill="var(--primary)" />
          <Bar dataKey="actualKwh" radius={[3, 3, 0, 0]}>
            {chartData.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.actualKwh <= entry.baselineKwh ? "#52b788" : "#e57373"}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
          {monthlyEnergy
            .filter((d) => d.events.length > 0)
            .map((d) => (
              <ReferenceLine
                key={d.month}
                x={d.month}
                stroke="rgba(108,178,255,0.4)"
                strokeDasharray="4 3"
                label={{
                  value: d.events[0].label,
                  position: "top",
                  fill: "#6cb2ff",
                  fontSize: 9,
                }}
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
