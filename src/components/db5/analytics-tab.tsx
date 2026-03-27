"use client";

import Link from "next/link";
import {
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  anomalySeries,
  decomposition,
  driftRows,
  forecast48h,
  rollingEfficiency,
} from "@/data/db5";

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/[0.06] bg-[var(--surface)] p-4">
      <h3 className="text-[13px] font-semibold text-[var(--text)]">{title}</h3>
      <p className="text-[11px] text-[var(--text-muted)] mt-0.5 mb-3">{subtitle}</p>
      {children}
    </section>
  );
}

export function AnalyticsTab() {
  return (
    <div className="space-y-6">
      <Card
        title="30-Day Rolling Efficiency"
        subtitle="kW/RT, kJ/m3, and W/m2 plotted with synchronized time axis"
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={rollingEfficiency}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="date" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={2} />
            <YAxis yAxisId="a" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <YAxis yAxisId="b" orientation="right" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <YAxis yAxisId="c" orientation="right" hide />
            <Tooltip />
            <Legend />
            <Line yAxisId="a" dataKey="kwPerRt" stroke="#52b788" dot={false} name="kW/RT" />
            <Line yAxisId="b" dataKey="kjPerM3" stroke="#6cb2ff" dot={false} name="kJ/m3" />
            <Line yAxisId="c" dataKey="wPerM2" stroke="#f6c344" dot={false} name="W/m2" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="text-[10px] text-[var(--primary-bright)] mt-2">
          Trend annotation: chiller kW/RT improving over last 30 days.
        </div>
      </Card>

      <Card
        title="48H Energy Forecast"
        subtitle="Predicted load with confidence interval band and actual overlay"
      >
        <ResponsiveContainer width="100%" height={320}>
          <ComposedChart data={forecast48h}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="h" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={5} />
            <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line dataKey="upper" stroke="#74c69d" dot={false} strokeDasharray="4 4" name="Upper CI" />
            <Line dataKey="lower" stroke="#74c69d" dot={false} strokeDasharray="4 4" name="Lower CI" />
            <Line dataKey="predicted" stroke="#52b788" dot={false} name="Predicted" />
            <Line dataKey="actual" stroke="#f6c344" dot={false} name="Actual (partial)" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="text-[10px] text-[var(--text-faint)] mt-2">
          Requires 30+ days of data for stable forecasting.
        </div>
      </Card>

      <Card
        title="Anomaly Detection Log"
        subtitle="Z-score thresholds at ±2σ and ±3σ with fault-classification markers"
      >
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={anomalySeries}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="t" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={3} />
            <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Line dataKey="z" stroke="#6cb2ff" dot={false} name="Z-score" />
            <ReferenceLine y={2} stroke="#f6c344" strokeDasharray="4 4" />
            <ReferenceLine y={-2} stroke="#f6c344" strokeDasharray="4 4" />
            <ReferenceLine y={3} stroke="#e57373" strokeDasharray="4 4" />
            <ReferenceLine y={-3} stroke="#e57373" strokeDasharray="4 4" />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex gap-2 mt-2">
          <Link href="/operations" className="text-[11px] text-[var(--primary-bright)] hover:underline">
            Open DB-2
          </Link>
          <Link href="/engineering" className="text-[11px] text-[var(--primary-bright)] hover:underline">
            Open DB-6
          </Link>
        </div>
      </Card>

      <Card
        title="Sensor Drift Detector"
        subtitle="7-day moving average shifted >5% vs 30-day baseline"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-[var(--text-faint)]">
                <th className="text-left py-2 pr-3">Point</th>
                <th className="text-left py-2 pr-3">Sensor</th>
                <th className="text-left py-2 pr-3">7-day avg</th>
                <th className="text-left py-2 pr-3">30-day baseline</th>
                <th className="text-left py-2 pr-3">Drift</th>
                <th className="text-left py-2">Link</th>
              </tr>
            </thead>
            <tbody>
              {driftRows.map((row) => (
                <tr key={row.id} className="border-b border-white/[0.04]">
                  <td className="py-2 pr-3 font-mono text-[var(--text-muted)]">{row.id}</td>
                  <td className="py-2 pr-3">{row.sensor}</td>
                  <td className="py-2 pr-3">{row.avg7d}</td>
                  <td className="py-2 pr-3">{row.baseline30d}</td>
                  <td className="py-2 pr-3">
                    <span className="text-[var(--warning)] bg-[rgba(246,195,68,0.14)] px-2 py-0.5 rounded">
                      {row.driftPct.toFixed(1)}% alert
                    </span>
                  </td>
                  <td className="py-2">
                    <Link href="/engineering" className="text-[var(--primary-bright)] hover:underline">
                      DB-6 DDC Deep Dive
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title="Long-term Trend Decomposition"
        subtitle="Seasonal, trend, and residual components for degradation visibility"
      >
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={decomposition}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="t" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={3} />
            <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line dataKey="trend" stroke="#52b788" dot={false} name="Trend" />
            <Line dataKey="seasonal" stroke="#6cb2ff" dot={false} name="Seasonal" />
            <Line dataKey="residual" stroke="#a7c4b5" dot={false} name="Residual" />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
