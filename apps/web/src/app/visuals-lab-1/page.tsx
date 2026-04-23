"use client";

import Link from "next/link";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowRight, Paintbrush, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const loadCurve = Array.from({ length: 28 }, (_, i) => ({
  h: i,
  kw: 118 + Math.sin(i / 3.2) * 22 + (i % 4) * 1.8,
}));

type SectionProps = {
  title: string;
  description: string;
  badge: string;
  children: React.ReactNode;
};

function Section({ title, description, badge, children }: SectionProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[rgba(24,28,35,0.72)] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4 border-b border-white/[0.06] bg-[rgba(255,255,255,0.02)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--text-faint)] font-semibold">
              {badge}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-[var(--text)]">{title}</h2>
          <p className="text-[13px] text-[var(--text-muted)] mt-1 max-w-2xl leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export default function VisualsLab1Page() {
  return (
    <div className="space-y-8 w-full">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[var(--text-faint)] font-semibold">
          <Paintbrush className="w-4 h-4 text-[var(--primary-bright)]" aria-hidden />
          Visuals Lab 1
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text)]">Motion, glass, and load curves</h1>
            <p className="text-sm text-[var(--text-muted)] mt-1 max-w-2xl">
              First sandbox for publishable-quality visuals. Token QA and the full component matrix stay in Design Lab;
              this lane is for quicker iteration on look-and-feel.
            </p>
          </div>
          <Link
            href="/design-lab"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium",
              "border border-[rgba(101,212,161,0.35)] bg-[rgba(101,212,161,0.1)] text-[var(--primary-bright)]",
              "hover:bg-[rgba(101,212,161,0.16)] transition-colors duration-200"
            )}
          >
            Open Design Lab
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
        <Section
          badge="Charts"
          title="Soft axes, teal fill"
          description="Single-series area with minimal chrome—matches Orion-style energy overlays without a legend box."
        >
          <div className="h-[280px] w-full min-w-0 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={280}>
              <AreaChart data={loadCurve} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="vl1Fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(101,212,161,0.45)" />
                    <stop offset="100%" stopColor="rgba(101,212,161,0.02)" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="h"
                  tick={{ fill: "var(--text-faint)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                  label={{ value: "Hour", position: "insideBottom", offset: -4, fill: "var(--text-faint)", fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: "var(--text-faint)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  label={{
                    value: "kW",
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--text-faint)",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15,18,24,0.94)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 10,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: "var(--text-muted)" }}
                  formatter={(v: number) => [`${v.toFixed(1)} kW`, "Load"]}
                  labelFormatter={(l) => `Hour ${l}`}
                />
                <Area
                  type="monotone"
                  dataKey="kw"
                  stroke="var(--primary-bright)"
                  strokeWidth={2}
                  fill="url(#vl1Fill)"
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--primary-bright)", stroke: "#0b0f14", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section
          badge="Surfaces"
          title="Glass stack and hover lift"
          description="Three tiers: base panel, elevated glass, and a fault accent reserved for alerts."
        >
          <div className="grid grid-cols-1 gap-3">
            <div className="rounded-xl border border-white/[0.08] bg-[rgba(32,37,46,0.55)] p-4 transition-all duration-200 hover:border-[rgba(101,212,161,0.28)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)]">
              <div className="text-sm font-semibold text-[var(--text)]">Base tier</div>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">Default cards and tables.</p>
            </div>
            <div className="rounded-xl border border-[rgba(101,212,161,0.28)] bg-[rgba(24,30,28,0.55)] backdrop-blur-md p-4 shadow-[0_0_0_1px_rgba(101,212,161,0.15),0_16px_40px_rgba(0,0,0,0.38)] transition-all duration-200 hover:shadow-[0_0_0_1px_rgba(101,212,161,0.35),0_20px_48px_rgba(79,160,122,0.18)]">
              <div className="text-sm font-semibold text-[var(--text)]">Glass hero</div>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">Maps, 3D shells, and floating controls.</p>
            </div>
            <div className="rounded-xl border border-[rgba(229,115,115,0.35)] bg-[rgba(229,115,115,0.08)] p-4">
              <div className="text-sm font-semibold text-[var(--text)]">Fault accent</div>
              <p className="text-[12px] text-[var(--text-muted)] mt-1">Use sparingly; keep series colors on teal.</p>
            </div>
          </div>
        </Section>
      </div>

      <Section
        badge="Motion"
        title="Scroll-linked hero sheen (static preview)"
        description="Design Lab runs the live scroll demo; here is a frozen frame with the same grid and radial wash."
      >
        <div className="relative overflow-hidden rounded-xl border border-white/[0.1] min-h-[160px]">
          <div className="absolute inset-0 opacity-50 bg-[radial-gradient(circle_at_20%_20%,rgba(101,212,161,0.2),transparent_38%),radial-gradient(circle_at_80%_40%,rgba(108,178,255,0.14),transparent_36%)]" />
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.15]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="relative flex items-center justify-between gap-3 p-5">
            <div className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
              <Sparkles className="w-4 h-4 text-[var(--primary-bright)]" aria-hidden />
              Parity with Design Lab hero treatment
            </div>
            <span className="text-[11px] text-[var(--text-faint)] uppercase tracking-[0.14em]">Lab 1 · snapshot</span>
          </div>
        </div>
      </Section>
    </div>
  );
}
