"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  BadgeCheck,
  CheckCircle2,
  Droplets,
  Flame,
  Gauge,
  LayoutTemplate,
  Map,
  MousePointer2,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  badge?: string;
};

type Swatch = {
  name: string;
  token: string;
  hex: string;
  sample?: string;
};

const palette: Swatch[] = [
  { name: "Background", token: "--bg", hex: "#0A0F0D", sample: "var(--bg)" },
  { name: "Surface", token: "--surface", hex: "#111B16", sample: "var(--surface)" },
  {
    name: "Surface Hover",
    token: "--surface-hover",
    hex: "#1A2B22",
    sample: "var(--surface-hover)",
  },
  { name: "Primary", token: "--primary", hex: "#2D6A4F", sample: "var(--primary)" },
  {
    name: "Accent / Bright",
    token: "--primary-bright",
    hex: "#52B788",
    sample: "var(--primary-bright)",
  },
  { name: "Glow Mid", token: "--primary-soft", hex: "#40916C", sample: "var(--primary-soft)" },
  { name: "Text", token: "--text", hex: "#E8F5E9", sample: "var(--text)" },
  {
    name: "Text Muted",
    token: "--text-muted",
    hex: "#A7C4B5",
    sample: "var(--text-muted)",
  },
  { name: "Danger", token: "--danger", hex: "#E57373", sample: "var(--danger)" },
  { name: "Warning", token: "--warning", hex: "#F6C344", sample: "var(--warning)" },
  { name: "Info", token: "--info", hex: "#6CB2FF", sample: "var(--info)" },
];

const lineData = [
  { name: "Mon", baseline: 92, actual: 86 },
  { name: "Tue", baseline: 96, actual: 88 },
  { name: "Wed", baseline: 94, actual: 90 },
  { name: "Thu", baseline: 97, actual: 83 },
  { name: "Fri", baseline: 95, actual: 87 },
  { name: "Sat", baseline: 92, actual: 79 },
  { name: "Sun", baseline: 90, actual: 82 },
];

const barData = [
  { name: "Lighting", saving: 18, baseline: 64 },
  { name: "HVAC", saving: 22, baseline: 72 },
  { name: "Pumps", saving: 12, baseline: 54 },
  { name: "Elevators", saving: 8, baseline: 32 },
  { name: "Misc", saving: 9, baseline: 40 },
];

const pieData = [
  { name: "Grid", value: 54, color: "#2d6a4f" },
  { name: "Solar", value: 28, color: "#52b788" },
  { name: "Storage", value: 18, color: "#6cb2ff" },
];

const radarData = [
  { subject: "Comfort", a: 82 },
  { subject: "Efficiency", a: 92 },
  { subject: "Faults", a: 76 },
  { subject: "Readiness", a: 88 },
  { subject: "Sustainability", a: 90 },
];

const tableRows = [
  { system: "AHU-03", status: "Healthy", delta: "-8% kWh", action: "Watching" },
  {
    system: "Chiller-02",
    status: "Warning",
    delta: "+3% kWh",
    action: "Tune PID",
  },
  { system: "Cooling Tower", status: "Healthy", delta: "-5% kWh", action: "OK" },
  { system: "Lighting L3", status: "Info", delta: "-2% kWh", action: "Schedule" },
  { system: "Boiler-01", status: "Risk", delta: "+6% kWh", action: "Investigate" },
];

const sparkline = [68, 72, 71, 74, 80, 77, 82];

function SectionCard({ title, description, children, badge }: SectionProps) {
  return (
    <section className="bg-surface border border-white/[0.06] rounded-lg p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm md:text-base font-semibold text-foreground">{title}</h2>
            {badge && (
              <span className="px-2 py-0.5 text-[11px] rounded-full bg-white/[0.06] text-foreground-muted border border-white/[0.08]">
                {badge}
              </span>
            )}
          </div>
          <p className="text-[12px] md:text-[13px] text-foreground-faint mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function SwatchCard({ swatch }: { swatch: Swatch }) {
  return (
    <div className="group rounded-md border border-white/[0.06] overflow-hidden bg-surface transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_40px_rgba(0,0,0,0.35)]">
      <div
        className="h-16"
        style={{
          background: swatch.sample ?? swatch.hex,
          filter: swatch.token.includes("primary")
            ? "drop-shadow(0 0 6px rgba(82,183,136,0.45))"
            : undefined,
        }}
      />
      <div className="p-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-foreground">{swatch.name}</div>
          <div className="text-[11px] text-foreground-faint">{swatch.token}</div>
        </div>
        <div className="text-[11px] text-foreground-muted font-mono">{swatch.hex}</div>
      </div>
    </div>
  );
}

function DarkTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-[rgba(17,27,22,0.95)] border border-white/[0.08] rounded-md px-3 py-2.5 shadow-lg text-xs min-w-[160px]">
      <div className="text-foreground font-semibold mb-1.5">{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-sm" style={{ background: item.color }} />
          <span className="text-foreground-muted">{item.name}</span>
          <span className="text-foreground font-medium ml-auto">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ label, tone }: { label: string; tone: "success" | "warning" | "danger" | "info" }) {
  const colors = {
    success: "bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)] border-[rgba(82,183,136,0.35)]",
    warning: "bg-[rgba(246,195,68,0.12)] text-[var(--warning)] border-[rgba(246,195,68,0.35)]",
    danger: "bg-[rgba(229,115,115,0.12)] text-[var(--danger)] border-[rgba(229,115,115,0.35)]",
    info: "bg-[rgba(108,178,255,0.12)] text-[var(--info)] border-[rgba(108,178,255,0.35)]",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border",
        colors[tone]
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        "group relative inline-flex items-center gap-2 px-3 py-2 rounded-md border text-[13px] transition-all duration-200",
        checked
          ? "border-[rgba(82,183,136,0.35)] bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)] shadow-[0_0_0_1px_rgba(82,183,136,0.35),0_10px_30px_rgba(64,145,108,0.2)]"
          : "border-white/[0.08] bg-surface-hover/60 text-foreground-muted hover:border-white/[0.12]"
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          "w-10 h-5 rounded-full transition-all duration-200 flex items-center px-1",
          checked ? "bg-[rgba(82,183,136,0.4)]" : "bg-white/[0.08]"
        )}
      >
        <span
          className={cn(
            "w-3.5 h-3.5 rounded-full bg-white transition-all duration-200 shadow",
            checked ? "translate-x-[14px]" : "translate-x-0"
          )}
        />
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default function DesignLabPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "kpis" | "engineering">("overview");
  const [toggleStates, setToggleStates] = useState({ autoPilot: true, dense: false });
  const [cursorGlow, setCursorGlow] = useState({ x: 50, y: 50 });

  const sparklinePoints = useMemo(() => sparkline.map((v, i) => ({ v, i })), []);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-[1440px] mx-auto">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-foreground-faint font-semibold">
          <Sparkles className="w-4 h-4 text-[var(--primary-bright)]" />
          Design Lab — Theme QA
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Design System Demo (Dark Forest)
            </h1>
            <p className="text-sm text-foreground-muted mt-1 max-w-2xl">
              Visual checklist for every decision we locked: palette, typography, cards, micro-interactions, charts,
              and placeholders for 3D + maps. This page is isolated from the main product demo.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[12px] border border-white/[0.08] bg-white/[0.04] text-foreground-muted">
              tokens.css aligned
            </span>
            <span className="px-3 py-1 rounded-full text-[12px] border border-[rgba(82,183,136,0.35)] text-[var(--primary-bright)] bg-[rgba(82,183,136,0.12)]">
              Ready for visual approval
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Colors & Gradients"
          description="Canonical palette, gradients, and glow treatments. Hover to see lift + glow behavior."
          badge="Foundations"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {palette.map((swatch) => (
              <SwatchCard key={swatch.token} swatch={swatch} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            <div className="relative h-28 rounded-md overflow-hidden border border-white/[0.08] bg-[var(--gradient-hero)] shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_14px_40px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(82,183,136,0.18)] via-transparent to-[rgba(82,183,136,0.25)]" />
              <div className="absolute inset-0 flex flex-col justify-end p-3">
                <div className="text-[11px] text-foreground-faint">Hero gradient</div>
                <div className="text-sm font-semibold text-foreground">Glow-ready background</div>
              </div>
            </div>
            <div className="h-28 rounded-md border border-white/[0.08] bg-surface flex items-center justify-center text-center px-4">
              <div>
                <div className="text-[11px] text-foreground-faint mb-1">Chart Fill</div>
                <div className="w-full h-2 rounded-full overflow-hidden bg-white/[0.04]">
                  <div className="h-full w-full" style={{ background: "var(--gradient-chart)" }} />
                </div>
                <div className="text-xs text-foreground-muted mt-2">
                  Monotone lines use drop-shadow glow; fills use `--gradient-chart`.
                </div>
              </div>
            </div>
            <div className="h-28 rounded-md border border-white/[0.08] bg-surface-hover/40 flex items-center justify-center text-center px-4">
              <div className="text-xs text-foreground-muted">
                Borders use `rgba(255,255,255,0.06)` with hover glow `rgba(64,145,108,0.25)`.
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Typography & Buttons"
          description="Plus Jakarta Sans across headings, body, and captions. Buttons show primary, ghost, destructive, and icon-only states."
          badge="Type & Actions"
        >
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <div className="bg-surface-hover/40 border border-white/[0.08] rounded-md p-3 w-full md:w-[48%]">
                <div className="text-[13px] text-foreground-faint mb-1">Headings</div>
                <div className="text-2xl font-bold text-foreground leading-tight">H1 — Bold 24px</div>
                <div className="text-xl font-semibold text-foreground/90 leading-tight">H2 — Semibold 20px</div>
                <div className="text-lg font-semibold text-foreground/80 leading-tight">H3 — 16px</div>
              </div>
              <div className="bg-surface-hover/40 border border-white/[0.08] rounded-md p-3 w-full md:w-[48%] space-y-1">
                <div className="text-[13px] text-foreground-faint">Body & Meta</div>
                <p className="text-sm text-foreground">
                  Body text — 14px with comfortable line height for data-rich panels.
                </p>
                <p className="text-[12px] text-foreground-muted">
                  Caption — 12px muted; use for helper text, axes, and small labels.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2.5 rounded-md bg-[var(--primary)] text-white text-[13px] font-semibold border border-white/[0.04] shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_34px_rgba(64,145,108,0.25)] transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.45),0_16px_40px_rgba(64,145,108,0.3)]">
                Primary Action
              </button>
              <button className="px-4 py-2.5 rounded-md border border-white/[0.12] text-[13px] text-foreground transition-all duration-200 bg-surface hover:border-[rgba(82,183,136,0.4)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_34px_rgba(64,145,108,0.2)]">
                Ghost
              </button>
              <button className="px-4 py-2.5 rounded-md border border-[rgba(229,115,115,0.4)] text-[13px] text-[var(--danger)] bg-[rgba(229,115,115,0.08)] hover:bg-[rgba(229,115,115,0.12)] transition-all duration-200">
                Destructive
              </button>
              <button className="p-2.5 rounded-md border border-white/[0.12] text-foreground-muted hover:text-foreground hover:border-[rgba(82,183,136,0.4)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_10px_28px_rgba(64,145,108,0.2)] transition-all duration-200">
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Cards & KPI treatments"
          description="Standard card with dividers, KPI with sparkline, and data card with subtle separator."
          badge="Surfaces"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="group bg-surface border border-white/[0.06] rounded-md p-4 transition-all duration-200 hover:border-[rgba(82,183,136,0.35)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_14px_36px_rgba(64,145,108,0.18)]">
              <div className="flex items-center gap-2 mb-2 text-xs uppercase tracking-wide text-foreground-faint">
                <LayoutTemplate className="w-3.5 h-3.5 text-[var(--primary-bright)]" />
                Base Card
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Surface + border</div>
                  <div className="text-[12px] text-foreground-muted">
                    Subtle divider, 16–20px padding, hover glow.
                  </div>
                </div>
                <BadgeCheck className="w-4 h-4 text-[var(--primary-bright)]" />
              </div>
            </div>

            <div className="group bg-surface border border-white/[0.06] rounded-md p-4 transition-all duration-200 hover:border-[rgba(82,183,136,0.35)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_14px_36px_rgba(64,145,108,0.18)]">
              <div className="text-[11px] text-foreground-faint font-medium uppercase tracking-wider mb-2">
                KPI — Energy Intensity
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xl font-bold text-foreground">84.2</div>
                  <div className="flex items-center gap-1 text-[11px] text-[var(--primary-bright)]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    6.4% vs baseline
                  </div>
                </div>
                <div className="w-[110px] h-[52px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklinePoints} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="kpi-spark" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#52b788" stopOpacity={0.35} />
                          <stop offset="100%" stopColor="#52b788" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area
                        type="monotone"
                        dataKey="v"
                        stroke="#52b788"
                        fill="url(#kpi-spark)"
                        strokeWidth={1.8}
                        isAnimationActive={false}
                        dot={false}
                        style={{ filter: "drop-shadow(0 0 6px rgba(82,183,136,0.5))" }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="group bg-surface border border-white/[0.06] rounded-md p-4 transition-all duration-200 hover:border-[rgba(82,183,136,0.35)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_14px_36px_rgba(64,145,108,0.18)]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-semibold text-foreground">Data Card</div>
                <StatusPill label="Healthy" tone="success" />
              </div>
              <div className="text-[12px] text-foreground-muted">
                Includes muted divider and meta row. Hover glow communicates interactivity without deep shadows.
              </div>
              <div className="border-t border-white/[0.06] mt-3 pt-3 flex items-center gap-2 text-[11px] text-foreground-faint">
                <Activity className="w-3.5 h-3.5" />
                Updated 5 min ago — feed from real-time stream
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Inputs, Toggles, Tabs, Badges"
          description="Form controls with dark surfaces and primary focus ring; underline tabs + status pills."
          badge="Controls"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[12px] text-foreground-muted">Text input</label>
              <input
                className="w-full rounded-md bg-surface-hover border border-white/[0.12] px-3 py-2.5 text-sm text-foreground placeholder:text-foreground-faint focus:border-[rgba(82,183,136,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(82,183,136,0.25)] transition-all duration-200"
                placeholder="Inspection note..."
              />
              <label className="text-[12px] text-foreground-muted">Select</label>
              <select className="w-full rounded-md bg-surface-hover border border-white/[0.12] px-3 py-2.5 text-sm text-foreground focus:border-[rgba(82,183,136,0.55)] focus:outline-none focus:ring-2 focus:ring-[rgba(82,183,136,0.25)] transition-all duration-200">
                <option>Owner mode</option>
                <option>Facility Manager</option>
                <option>Engineer</option>
              </select>
              <div className="flex items-center gap-2 text-[12px] text-foreground-muted">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded border-white/[0.2] bg-surface-hover accent-[var(--primary)]"
                />
                Email me weekly summaries
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Toggle
                  label="Auto-Pilot"
                  checked={toggleStates.autoPilot}
                  onChange={() =>
                    setToggleStates((p) => ({ ...p, autoPilot: !p.autoPilot }))
                  }
                />
                <Toggle
                  label="Dense mode"
                  checked={toggleStates.dense}
                  onChange={() =>
                    setToggleStates((p) => ({ ...p, dense: !p.dense }))
                  }
                />
              </div>
              <div>
                <div className="flex items-center gap-3 border-b border-[var(--border)]">
                  {(["overview", "kpis", "engineering"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "relative px-2.5 pb-2 text-[13px] font-semibold transition-all duration-200",
                        activeTab === tab
                          ? "text-[var(--primary-bright)]"
                          : "text-foreground-faint hover:text-foreground"
                      )}
                    >
                      {tab.toUpperCase()}
                      {activeTab === tab && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary-bright)] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="text-[12px] text-foreground-muted mt-2">
                  {activeTab === "overview" && "Use tabs with minimal underline; active state uses primary bright."}
                  {activeTab === "kpis" && "KPI view favors dense grids with hover glow on cards."}
                  {activeTab === "engineering" && "Engineering view: sticky filters + dense tables."}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusPill label="Healthy" tone="success" />
                <StatusPill label="Warning" tone="warning" />
                <StatusPill label="At Risk" tone="danger" />
                <StatusPill label="Info" tone="info" />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Table (dense, sticky header)"
          description="No zebra; row hover uses primary tint; sticky header and compact padding."
          badge="Data"
        >
          <div className="border border-white/[0.08] rounded-md overflow-hidden">
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface-hover border-b border-white/[0.08]">
                  <tr className="text-left text-[12px] text-foreground-muted">
                    <th className="px-3 py-2 font-medium">System</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                    <th className="px-3 py-2 font-medium">Delta</th>
                    <th className="px-3 py-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row) => (
                    <tr
                      key={row.system}
                      className="border-b border-white/[0.04] last:border-0 hover:bg-[rgba(82,183,136,0.06)] transition-colors"
                    >
                      <td className="px-3 py-2 font-medium text-foreground">{row.system}</td>
                      <td className="px-3 py-2">
                        <StatusPill
                          label={row.status}
                          tone={
                            row.status === "Healthy"
                              ? "success"
                              : row.status === "Warning"
                                ? "warning"
                                : row.status === "Risk"
                                  ? "danger"
                                  : "info"
                          }
                        />
                      </td>
                      <td className="px-3 py-2 text-[13px] text-foreground-muted">{row.delta}</td>
                      <td className="px-3 py-2 text-[13px] text-foreground text-right">{row.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Panel / Drawer"
          description="Slide-in style with sticky header + footer; 420–480px width target. Hover glow on primary action."
          badge="Pattern"
        >
          <div className="bg-surface-hover/50 border border-white/[0.08] rounded-lg overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.35)] max-w-xl">
            <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-surface">
              <div>
                <div className="text-xs uppercase text-foreground-faint tracking-[0.12em]">Optimization run</div>
                <div className="text-sm font-semibold text-foreground">Chiller plant — Off-peak tuning</div>
              </div>
              <StatusPill label="Active" tone="success" />
            </div>
            <div className="p-4 space-y-2 text-[13px] text-foreground-muted max-h-52 overflow-auto">
              <div className="flex items-center gap-2 text-foreground">
                <Gauge className="w-4 h-4 text-[var(--primary-bright)]" />
                <span className="font-semibold">Target:</span> COP > 6.1 (current 6.4)
              </div>
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[var(--info)]" />
                Condenser water reset based on wet-bulb
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[var(--warning)]" />
                Watchlist: Boiler-01 cycling — suggest PID tune
              </div>
              <div className="border border-white/[0.06] rounded-md p-3 text-foreground">
                <div className="text-[12px] text-foreground-faint mb-1">Notes</div>
                Glide-in animation: fade + slight slide; sticky footer holds actions.
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center justify-between gap-2 px-4 py-3 border-t border-white/[0.08] bg-surface">
              <button className="text-[13px] text-foreground-muted px-3 py-2 rounded-md border border-white/[0.08] hover:border-white/[0.14] transition-colors">
                Dismiss
              </button>
              <button className="text-[13px] font-semibold px-4 py-2 rounded-md bg-[var(--primary)] text-white border border-white/[0.08] shadow-[0_0_0_1px_rgba(82,183,136,0.35),0_12px_32px_rgba(64,145,108,0.25)] hover:-translate-y-[1px] transition-all duration-200">
                Apply change
              </button>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Charts — publishable quality"
        description="Monotone lines with glow, gradients for fills, annotations via tooltips. Limited hues: primary spectrum + danger."
        badge="Data Viz"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-surface-hover/50 border border-white/[0.08] rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Load vs Baseline</div>
                <div className="text-[11px] text-foreground-faint">Line + gradient area, custom tooltip</div>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-foreground-muted">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--primary)]" /> Baseline
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[var(--primary-bright)]" /> Actual
                </span>
              </div>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={lineData} margin={{ left: 0, right: 0, top: 6, bottom: 0 }}>
                  <defs>
                    <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#52b788" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#52b788" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={{ stroke: "rgba(255,255,255,0.08)" }} />
                  <YAxis tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Baseline"
                    stroke="#2d6a4f"
                    strokeWidth={2.2}
                    dot={false}
                    strokeDasharray="4 3"
                  />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#52b788"
                    strokeWidth={2.5}
                    fill="url(#area-fill)"
                    dot={{ r: 2, fill: "#52b788" }}
                    isAnimationActive={false}
                    style={{ filter: "drop-shadow(0 0 6px rgba(82,183,136,0.5))" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-surface-hover/50 border border-white/[0.08] rounded-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">Savings by system</div>
                  <div className="text-[11px] text-foreground-faint">Bar + gradient highlight</div>
                </div>
                <StatusPill label="Live" tone="info" />
              </div>
              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData} margin={{ left: -10, right: 6 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                    <Bar dataKey="saving" name="Saving (kWh)" radius={[3, 3, 0, 0]} fill="url(#bar-fill)">
                      <defs>
                        <linearGradient id="bar-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#52b788" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#52b788" stopOpacity={0.4} />
                        </linearGradient>
                      </defs>
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-surface-hover/50 border border-white/[0.08] rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-foreground">Energy mix</div>
                  <div className="text-[11px] text-foreground-faint">Pie + radar mini</div>
                </div>
                <Zap className="w-4 h-4 text-[var(--primary-bright)]" />
              </div>
              <div className="flex items-center gap-3">
                <div className="w-28 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={30}
                        outerRadius={50}
                        stroke="none"
                        paddingAngle={3}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: "#a7c4b5", fontSize: 10 }} />
                      <PolarRadiusAxis tick={false} stroke="rgba(255,255,255,0.06)" />
                      <Radar
                        name="Score"
                        dataKey="a"
                        stroke="#52b788"
                        fill="url(#radar-fill)"
                        strokeWidth={2}
                        fillOpacity={1}
                      />
                      <defs>
                        <linearGradient id="radar-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#52b788" stopOpacity={0.28} />
                          <stop offset="100%" stopColor="#52b788" stopOpacity={0.08} />
                        </linearGradient>
                      </defs>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Micro-interactions"
          description="Hover glow, tiny icon motion, and cursor-follow glow. Animations honor reduced-motion."
          badge="Motion"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="group bg-surface border border-white/[0.08] rounded-md p-4 transition-all duration-200 hover:border-[rgba(82,183,136,0.35)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_30px_rgba(64,145,108,0.2)] hover:-translate-y-[1px]">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <MousePointer2 className="w-4 h-4 text-[var(--primary-bright)] group-hover:translate-x-[1px] transition-transform duration-200" />
                Hover glow
              </div>
              <p className="text-[12px] text-foreground-muted">
                Border + glow lift on hover with 200–300ms ease. Matches Supabase-inspired feel.
              </p>
            </div>
            <div className="group bg-surface border border-white/[0.08] rounded-md p-4 transition-all duration-200 hover:border-[rgba(82,183,136,0.35)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
                <Sparkles className="w-4 h-4 text-[var(--warning)] group-hover:rotate-2 group-hover:scale-105 transition-transform duration-200" />
                Icon micro-move
              </div>
              <p className="text-[12px] text-foreground-muted">
                Icons scale 1.05 + rotate 2° on hover; small but visible cue.
              </p>
            </div>
            <div
              className="relative overflow-hidden bg-surface border border-white/[0.08] rounded-md p-4"
              onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setCursorGlow({ x, y });
              }}
              onMouseLeave={() => setCursorGlow({ x: 50, y: 50 })}
              style={{
                background: `radial-gradient(450px circle at ${cursorGlow.x}% ${cursorGlow.y}%, rgba(64,145,108,0.10), transparent 60%)`,
              }}
            >
              <div className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-[var(--primary-bright)]" />
                Cursor-follow glow
              </div>
              <p className="text-[12px] text-foreground-muted">
                Optional delight: a subtle spotlight that follows the cursor on hero/cards.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="3D + Map placeholders"
          description="Framing for embedded viewers/maps using dark surfaces, grid lines, and glow edge."
          badge="Shells"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative h-44 rounded-lg overflow-hidden border border-white/[0.1] bg-gradient-to-br from-[rgba(17,27,22,0.9)] via-[rgba(17,27,22,0.85)] to-[rgba(64,145,108,0.16)] shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_14px_40px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-foreground-faint">3D placeholder</div>
                <div className="text-sm font-semibold text-foreground">Viewer chrome matches theme</div>
              </div>
            </div>
            <div className="relative h-44 rounded-lg overflow-hidden border border-white/[0.1] bg-surface">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.14),transparent_30%),radial-gradient(circle_at_80%_40%,rgba(108,178,255,0.12),transparent_28%),radial-gradient(circle_at_50%_80%,rgba(229,115,115,0.12),transparent_30%)]" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-4">
                <div className="text-xs uppercase tracking-[0.14em] text-foreground-faint">Map placeholder</div>
                <div className="text-sm font-semibold text-foreground">Dark framing; plug-in Mapbox/tiles</div>
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-2 text-[11px] text-foreground-muted">
                <Map className="w-4 h-4" />
                <span>Layer controls</span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
