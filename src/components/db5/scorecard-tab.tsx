"use client";

import { useEffect, useMemo, useState } from "react";
import { animate } from "framer-motion";
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
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  chwResetDual,
  deadBandCompliance,
  deadBandHistogram,
  dsprLine,
  economyBars,
  effectivenessGaps,
  ossMonthlyHours,
  ossScatter,
  strategyCards,
  totalStrategySavingsKwh,
  topDeepDives,
  weeklyAttribution,
} from "@/data/db5";

function Odometer({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [value]);
  return (
    <span className="tabular-nums">
      {Math.round(display).toLocaleString()}
      {suffix}
    </span>
  );
}

function StrategyCardGrid() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusClass = (status: (typeof strategyCards)[number]["status"]) => {
    if (status === "active") {
      return {
        top: "border-t-[var(--primary-bright)]",
        badge: "bg-[rgba(82,183,136,0.15)] text-[var(--primary-bright)]",
        text: "ACTIVE",
      };
    }
    if (status === "underperforming") {
      return {
        top: "border-t-[var(--warning)]",
        badge: "bg-[rgba(246,195,68,0.15)] text-[var(--warning)]",
        text: "UNDERPERFORMING",
      };
    }
    if (status === "inactive") {
      return {
        top: "border-t-[var(--danger)]",
        badge: "bg-[rgba(229,115,115,0.15)] text-[var(--danger)]",
        text: "INACTIVE",
      };
    }
    return {
      top: "border-t-[var(--text-faint)]",
      badge: "bg-white/[0.06] text-[var(--text-faint)]",
      text: "N/A",
    };
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest">
            20-Strategy Status Grid
          </h2>
          <p className="text-[12px] text-[var(--text-muted)] mt-1">
            Click a card to expand details
          </p>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-[var(--surface)] px-3 py-2">
          <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-wider">
            Total monthly savings
          </div>
          <div className="text-[16px] font-semibold text-[var(--text)]">
            <Odometer value={totalStrategySavingsKwh} suffix=" kWh" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {strategyCards.map((s) => {
          const meta = statusClass(s.status);
          return (
            <button
              type="button"
              key={s.id}
              onClick={() => setExpanded(expanded === s.id ? null : s.id)}
              className={cn(
                "text-left rounded-md border border-white/[0.06] border-t-[3px] p-3 bg-[var(--surface)]",
                "hover:shadow-[0_0_0_1px_rgba(82,183,136,0.35),0_8px_28px_rgba(64,145,108,0.18)]",
                meta.top
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="text-[10px] text-[var(--text-faint)]">Opp. {s.oehOpp}</div>
                <span className={cn("text-[9px] font-semibold rounded px-1.5 py-0.5", meta.badge)}>
                  {meta.text}
                </span>
              </div>
              <div className="text-[13px] font-semibold text-[var(--text)] leading-snug mt-1">
                {s.name}
              </div>
              <div className="mt-2 text-[12px] text-[var(--text)] font-medium">
                {s.savingsKwh.toLocaleString()} kWh
              </div>
              <div className="text-[11px] text-[var(--primary-bright)]">
                ₩{(s.savingsCurrency / 1_000_000).toFixed(2)}M
              </div>
              <div className="text-[11px] mt-1">
                <span
                  className={
                    s.measuredVsExpectedPct >= 0
                      ? "text-[var(--primary-bright)]"
                      : "text-[var(--danger)]"
                  }
                >
                  {s.measuredVsExpectedPct >= 0 ? "↑" : "↓"}{" "}
                  {Math.abs(s.measuredVsExpectedPct).toFixed(1)}%
                </span>
                <span className="text-[var(--text-faint)]"> vs expected</span>
              </div>
              <div className="mt-2 h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={s.weeklySparkline.map((v, i) => ({ i, v }))}>
                    <Area
                      type="monotone"
                      dataKey="v"
                      stroke="#52b788"
                      fill="rgba(82,183,136,0.2)"
                      strokeWidth={1.4}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              {expanded === s.id && (
                <div className="mt-2 pt-2 border-t border-white/[0.06] text-[11px] text-[var(--text-muted)]">
                  {s.status === "active"
                    ? "Tracking to target. Continue M&V verification and monitor drift."
                    : "Below potential. Prioritize controls review and sequence tuning."}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Accordion({
  id,
  title,
  subtitle,
  children,
  openByDefault = false,
}: {
  id: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  openByDefault?: boolean;
}) {
  const [open, setOpen] = useState(openByDefault);
  return (
    <div id={id} className="rounded-md border border-white/[0.06] bg-[var(--surface)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3"
      >
        <div className="text-left">
          <div className="text-[14px] font-semibold text-[var(--text)]">{title}</div>
          <div className="text-[11px] text-[var(--text-muted)]">{subtitle}</div>
        </div>
        <ChevronDown
          className={cn("w-4 h-4 text-[var(--text-muted)] transition-transform", open && "rotate-180")}
        />
      </button>
      {open && <div className="border-t border-white/[0.06] p-4">{children}</div>}
    </div>
  );
}

function DeepDives() {
  const [fanReduction, setFanReduction] = useState(20);
  const fanSavings = Math.round(12000 * (1 - Math.pow(1 - fanReduction / 100, 3)));
  const groupedEconomy = economyBars.map((d) => ({ ...d, missed: d.available - d.active }));

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest">
          Top 5 Strategy Deep-Dives
        </h2>
      </div>

      <Accordion id="deep-dive-1" title="Opp. 1 — Optimum Start/Stop" subtitle="Actual vs optimal start windows" openByDefault>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-md border border-white/[0.06] p-3">
            <div className="text-[12px] text-[var(--text-muted)] mb-2">
              Scatter: red = too early, green = on-time
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <ScatterChart>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" dataKey="optimal" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
                <YAxis type="number" dataKey="actual" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
                <Tooltip />
                <Scatter data={ossScatter}>
                  {ossScatter.map((p, idx) => (
                    <Cell key={idx} fill={p.onTime ? "#52b788" : "#e57373"} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-md border border-white/[0.06] p-3">
            <div className="text-[12px] text-[var(--text-muted)] mb-2">Monthly operating hours saved</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ossMonthlyHours}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
                <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="hoursSaved" fill="#52b788" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-3">
          Algorithm combines occupancy, OAT, and building thermal inertia. Learning status: week 6/8.
        </p>
      </Accordion>

      <Accordion id="deep-dive-2" title="Opp. 2 — Setpoints & Dead Bands" subtitle="Histogram + compliance heatmap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-md border border-white/[0.06] p-3">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deadBandHistogram}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="band" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
                <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="zones" fill="#40916c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="text-[10px] text-[var(--warning)] mt-2">
              Each 1C below 2C dead band ≈ 10% more HVAC energy
            </div>
          </div>
          <div className="rounded-md border border-white/[0.06] p-3">
            <div className="grid grid-cols-8 gap-1">
              {deadBandCompliance.map((z) => (
                <div
                  key={z.zone}
                  title={z.zone}
                  className={cn(
                    "h-6 rounded-sm text-[8px] flex items-center justify-center",
                    z.compliant ? "bg-[rgba(82,183,136,0.35)]" : "bg-[rgba(229,115,115,0.3)]"
                  )}
                >
                  {z.zone.replace("Z-", "")}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Accordion>

      <Accordion id="deep-dive-5" title="Opp. 5 — Duct Static Pressure Reset" subtitle="Static pressure reset + affinity calculator">
        <div className="rounded-md border border-white/[0.06] p-3">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dsprLine}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="t" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
              <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#52b788" dot={false} name="Actual static pressure" />
              <Line type="monotone" dataKey="optimal" stroke="#6cb2ff" strokeDasharray="4 4" dot={false} name="Optimal reset" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-3">
            <label className="text-[11px] text-[var(--text-muted)]">
              Fan speed reduction: {fanReduction}%
            </label>
            <input
              className="w-full mt-1 accent-[var(--primary-bright)]"
              type="range"
              min={5}
              max={35}
              value={fanReduction}
              onChange={(e) => setFanReduction(Number(e.target.value))}
            />
            <div className="text-[12px] mt-2 text-[var(--primary-bright)]">
              Estimated monthly savings: {fanSavings.toLocaleString()} kWh
            </div>
            <div className="text-[10px] text-[var(--text-faint)]">-20% fan speed = -49% fan power</div>
          </div>
        </div>
      </Accordion>

      <Accordion id="deep-dive-7" title="Opp. 7 — Chilled Water Reset" subtitle="Dual-axis CHWS and kW/RT">
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={chwResetDual}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" tick={{ fill: "#a7c4b5", fontSize: 9 }} />
            <YAxis yAxisId="left" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="chws" stroke="#52b788" dot={false} name="CHWS setpoint" />
            <Line yAxisId="left" type="monotone" dataKey="optimalChws" stroke="#95d5b2" strokeDasharray="4 4" dot={false} name="Optimal CHWS" />
            <Line yAxisId="right" type="monotone" dataKey="kwrt" stroke="#e57373" dot={false} name="kW/RT current" />
            <Line yAxisId="right" type="monotone" dataKey="optimalKwrt" stroke="#6cb2ff" strokeDasharray="4 4" dot={false} name="kW/RT optimal" />
          </ComposedChart>
        </ResponsiveContainer>
      </Accordion>

      <Accordion id="deep-dive-10" title="Opp. 10 — Economy Cycle" subtitle="Hours active vs available">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={groupedEconomy}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="active" fill="#52b788" name="Active" radius={[4, 4, 0, 0]} />
            <Bar dataKey="available" fill="#6cb2ff" name="Available" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="text-[11px] text-[var(--text-muted)] mt-2">
          Savings estimate: {groupedEconomy.reduce((acc, d) => acc + d.missed, 0)} missed free-cooling hours x 35 kW offset.
        </div>
      </Accordion>
    </section>
  );
}

function SavingsAttribution() {
  const strategyKeys = useMemo<string[]>(
    () =>
      Array.from(
        new Set<string>(
          weeklyAttribution.flatMap((w) => w.strategies.map((s) => s.strategyId))
        )
      ),
    []
  );

  const rows = useMemo(() => {
    return weeklyAttribution.map((w) => {
      const out: Record<string, number | string> = { week: w.week };
      strategyKeys.forEach((k) => {
        out[k] = w.strategies.find((s) => s.strategyId === k)?.kwh ?? 0;
      });
      return out;
    });
  }, [strategyKeys]);

  const names = useMemo(() => {
    const map = new Map<string, string>();
    weeklyAttribution.forEach((w) =>
      w.strategies.forEach((s) => map.set(s.strategyId, s.name))
    );
    return map;
  }, []);

  const colors = ["#1b4332", "#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2"];

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest">
          Savings Attribution
        </h2>
      </div>

      <div className="rounded-md border border-white/[0.06] p-4 bg-[var(--surface)]">
        <div className="text-[13px] font-semibold text-[var(--text)] mb-2">
          Stacked weekly contribution by strategy
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={rows}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <YAxis tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {strategyKeys.map((k, i) => (
              <Bar key={k} dataKey={k} stackId="a" name={names.get(k) ?? k} fill={colors[i % colors.length]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-md border border-white/[0.06] p-4 bg-[var(--surface)]">
        <div className="text-[13px] font-semibold text-[var(--text)] mb-2">
          Strategy effectiveness gap ranking
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart
            data={[...effectivenessGaps].sort((a, b) => b.gap - a.gap)}
            layout="vertical"
            margin={{ left: 20, right: 24 }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={170} tick={{ fill: "#a7c4b5", fontSize: 10 }} />
            <Tooltip />
            <Bar
              dataKey="gap"
              fill="#52b788"
              radius={[0, 4, 4, 0]}
              onClick={(item) => {
                const payload = (item as { payload?: { strategyId?: string } }).payload;
                const opp = payload?.strategyId?.replace("s", "");
                if (!opp) return;
                document.getElementById(`deep-dive-${opp}`)?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export function ScorecardTab() {
  return (
    <div className="space-y-8">
      <StrategyCardGrid />
      <DeepDives />
      <SavingsAttribution />
      <div className="text-[10px] text-[var(--text-faint)]">
        Deep-dives shown for opportunities {topDeepDives.join(", ")}.
      </div>
    </div>
  );
}
