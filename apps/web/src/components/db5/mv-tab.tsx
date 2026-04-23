"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  baselineModel,
  caeSeries,
  mvSeries,
  paybackRows,
  waterfall,
  weatherNormEui,
} from "@/data/db5";

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-md border border-white/[0.06] bg-[var(--surface)] p-4">
      <h3 className="text-[13px] font-semibold text-[var(--text)]">{title}</h3>
      {subtitle && <p className="text-[11px] text-[var(--text-muted)] mt-0.5 mb-3">{subtitle}</p>}
      {children}
    </section>
  );
}

const stepMeta = [
  {
    step: 1 as const,
    label: "Baseline Model",
    note: "This model represents how the building used energy BEFORE optimization.",
  },
  {
    step: 2 as const,
    label: "Adjusted Baseline",
    note: "Weather-normalized prediction for this month.",
  },
  {
    step: 3 as const,
    label: "Actual Consumption",
    note: "Measured energy overlaid against adjusted baseline.",
  },
  {
    step: 4 as const,
    label: "Verified Savings",
    note: "Savings are baseline minus actual, with confidence band.",
  },
];

function Stepper({ step, onStep }: { step: 1 | 2 | 3 | 4; onStep: (s: 1 | 2 | 3 | 4) => void }) {
  return (
    <div className="mb-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 right-0 top-4 h-px bg-white/[0.14]" />
        {stepMeta.map((s) => (
          <button
            type="button"
            key={s.step}
            onClick={() => onStep(s.step)}
            className="relative z-10 flex flex-col items-center gap-2"
          >
            <span
              className={
                s.step <= step
                  ? "w-8 h-8 rounded-full bg-[var(--primary-bright)] text-[var(--bg)] text-[12px] font-bold flex items-center justify-center"
                  : "w-8 h-8 rounded-full bg-white/[0.08] text-[var(--text-muted)] text-[12px] font-bold flex items-center justify-center"
              }
            >
              {s.step}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] text-center max-w-[96px]">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function StepChart({ step }: { step: 1 | 2 | 3 | 4 }) {
  const regressionLine = useMemo(() => {
    const xs = baselineModel.scatter.map((p) => p.oatC);
    const min = Math.min(...xs);
    const max = Math.max(...xs);
    const { slope, intercept } = baselineModel.regression;
    return [
      { oatC: min, kw: slope * min + intercept },
      { oatC: max, kw: slope * max + intercept },
    ];
  }, []);

  if (step === 1) {
    return (
      <ResponsiveContainer width="100%" height={290}>
        <ComposedChart data={baselineModel.scatter}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis type="number" dataKey="oatC" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
          <YAxis type="number" dataKey="kw" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
          <Tooltip />
          <Scatter data={baselineModel.scatter} fill="#52b788" />
          <Line data={regressionLine} dataKey="kw" stroke="#95d5b2" dot={false} />
          <Line
            data={baselineModel.scatter.map((p, i) => ({ oatC: p.oatC, kw: baselineModel.ciUpper[i] }))}
            dataKey="kw"
            stroke="#6cb2ff"
            strokeDasharray="4 4"
            dot={false}
            name="CI upper"
          />
          <Line
            data={baselineModel.scatter.map((p, i) => ({ oatC: p.oatC, kw: baselineModel.ciLower[i] }))}
            dataKey="kw"
            stroke="#6cb2ff"
            strokeDasharray="4 4"
            dot={false}
            name="CI lower"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (step === 2) {
    return (
      <ResponsiveContainer width="100%" height={290}>
        <ComposedChart data={mvSeries}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="t" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={2} />
          <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
          <Tooltip />
          <Line dataKey="adjusted" stroke="#52b788" dot={false} name="Adjusted baseline" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  if (step === 3) {
    return (
      <ResponsiveContainer width="100%" height={290}>
        <ComposedChart data={mvSeries}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="t" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={2} />
          <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
          <Tooltip />
          <Legend />
          <Line dataKey="adjusted" stroke="#95d5b2" dot={false} name="Adjusted baseline" />
          <Line dataKey="actual" stroke="#52b788" dot={false} name="Actual" />
          <Area dataKey="savings" fill="rgba(82,183,136,0.14)" stroke="none" name="Gap (savings)" />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={290}>
        <ComposedChart data={mvSeries}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="t" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={2} />
          <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
          <Tooltip />
          <Line dataKey="ciUpper" stroke="#6cb2ff" strokeDasharray="4 4" dot={false} name="CI upper" />
          <Line dataKey="ciLower" stroke="#6cb2ff" strokeDasharray="4 4" dot={false} name="CI lower" />
          <Area dataKey="savings" fill="rgba(82,183,136,0.3)" stroke="#52b788" name="Verified savings" />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
        <div className="rounded-md border border-white/[0.06] p-3">
          <div className="text-[10px] text-[var(--text-faint)] uppercase">kWh verified</div>
          <div className="text-[16px] font-semibold text-[var(--text)]">
            {Math.round(mvSeries.reduce((a, d) => a + d.savings, 0)).toLocaleString()}
          </div>
        </div>
        <div className="rounded-md border border-white/[0.06] p-3">
          <div className="text-[10px] text-[var(--text-faint)] uppercase">$ avoided</div>
          <div className="text-[16px] font-semibold text-[var(--primary-bright)]">
            ₩{(mvSeries.reduce((a, d) => a + d.savings, 0) * 220 / 1_000_000).toFixed(2)}M
          </div>
        </div>
        <div className="rounded-md border border-white/[0.06] p-3">
          <div className="text-[10px] text-[var(--text-faint)] uppercase">tCO2e avoided</div>
          <div className="text-[16px] font-semibold text-[var(--text)]">
            {(mvSeries.reduce((a, d) => a + d.savings, 0) * 0.00042).toFixed(1)}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-[var(--text-faint)] mt-2">These savings are verified to 90% confidence.</div>
    </div>
  );
}

function WaterfallChart() {
  let running = 0;
  const data = waterfall.map((d) => {
    const start = running;
    running += d.kwh;
    return { ...d, start, end: running };
  });
  const total = running;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart data={[...data, { name: "Verified total", start: 0, end: total, kwh: total }]}>
        <CartesianGrid stroke="rgba(255,255,255,0.05)" />
        <XAxis dataKey="name" tick={{ fill: "#a7c4b5", fontSize: 9 }} interval={0} angle={-18} textAnchor="end" height={60} />
        <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
        <Tooltip />
        <ReferenceLine y={0} stroke="rgba(255,255,255,0.14)" />
        <Bar dataKey="end">
          {[...data, { name: "Verified total", start: 0, end: total, kwh: total }].map((row, i) => (
            <Cell key={i} fill={i === data.length ? "#6cb2ff" : "#52b788"} />
          ))}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function MVTab() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const paybackSorted = useMemo(
    () =>
      [...paybackRows].sort((a, b) => {
        const pa = a.savingsToDate / a.investment;
        const pb = b.savingsToDate / b.investment;
        return pb - pa;
      }),
    []
  );

  return (
    <div className="space-y-6">
      <Card title="Baseline vs Actual — Interactive Stepper">
        <Stepper step={step} onStep={setStep} />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="text-[11px] text-[var(--text-muted)] mb-2">
              {stepMeta.find((s) => s.step === step)?.note}
              {step === 1 && (
                <span className="text-[var(--primary-bright)] ml-1">
                  R² = {baselineModel.regression.r2.toFixed(2)}
                </span>
              )}
            </div>
            <StepChart step={step} />
          </motion.div>
        </AnimatePresence>
      </Card>

      <Card title="Cumulative Avoided Energy (CAE)" subtitle="Running total of energy not consumed">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={caeSeries}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="t" tick={{ fill: "#a7c4b5", fontSize: 9 }} />
            <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Area dataKey="cae" stroke="#52b788" fill="rgba(82,183,136,0.3)" />
            {caeSeries.filter((d) => d.milestone).map((m) => (
              <ReferenceLine key={m.t} x={m.t} stroke="#f6c344" strokeDasharray="3 3" />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Weather-Normalized EUI" subtitle="HDD/CDD adjusted energy intensity">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={weatherNormEui}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="period" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Bar dataKey="eui" fill="#52b788" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Live Payback Calculator" subtitle="Sorted by payback progress">
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-[var(--text-faint)]">
                <th className="text-left py-2 pr-3">Strategy</th>
                <th className="text-left py-2 pr-3">Investment</th>
                <th className="text-left py-2 pr-3">Savings to date</th>
                <th className="text-left py-2 pr-3">Revised payback</th>
                <th className="text-left py-2 pr-3">Original estimate</th>
                <th className="text-left py-2 pr-3">Delta</th>
                <th className="text-left py-2">Sparkline</th>
              </tr>
            </thead>
            <tbody>
              {paybackSorted.map((row) => {
                const delta = row.revisedPaybackMonths - row.originalEstimateMonths;
                return (
                  <tr key={row.strategyId} className="border-b border-white/[0.04]">
                    <td className="py-2 pr-3 text-[var(--text)]">{row.name}</td>
                    <td className="py-2 pr-3">₩{(row.investment / 1_000_000).toFixed(1)}M</td>
                    <td className="py-2 pr-3 text-[var(--primary-bright)]">₩{(row.savingsToDate / 1_000_000).toFixed(1)}M</td>
                    <td className="py-2 pr-3">{row.revisedPaybackMonths} mo</td>
                    <td className="py-2 pr-3">{row.originalEstimateMonths} mo</td>
                    <td className={delta <= 0 ? "py-2 pr-3 text-[var(--primary-bright)]" : "py-2 pr-3 text-[var(--danger)]"}>
                      {delta > 0 ? "+" : ""}
                      {delta} mo
                    </td>
                    <td className="py-2 w-28">
                      <ResponsiveContainer width="100%" height={24}>
                        <AreaChart data={row.spark.map((v, i) => ({ i, v }))}>
                          <Area dataKey="v" stroke="#52b788" fill="rgba(82,183,136,0.2)" dot={false} isAnimationActive={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Savings Waterfall" subtitle="Strategy-by-strategy contribution with running total">
        <WaterfallChart />
      </Card>
    </div>
  );
}
