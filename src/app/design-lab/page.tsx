"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  LabelList,
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
import { Canvas, useFrame } from "@react-three/fiber";
import { Edges, Float, OrbitControls, RoundedBox } from "@react-three/drei";
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

const barInlineData = [
  { name: "Lighting", saving: 18 },
  { name: "HVAC", saving: 22 },
  { name: "Pumps", saving: 12 },
  { name: "Elevators", saving: 8 },
  { name: "Misc", saving: 9 },
];

const donutData = [
  { name: "Grid", value: 54, color: "#2d6a4f" },
  { name: "Solar", value: 28, color: "#52b788" },
  { name: "Storage", value: 18, color: "#6cb2ff" },
];

const heatmapData = Array.from({ length: 6 }).map((_, row) =>
  Array.from({ length: 12 }).map((_, col) => {
    const base = 40 + row * 6 + (col % 4) * 2;
    return Math.min(100, Math.max(22, base + (Math.sin(col) * 6 - row * 2)));
  })
);

const eventRiver = [
  { label: "Optimization", tone: "success" as const, pos: "10%" },
  { label: "Fault", tone: "danger" as const, pos: "32%" },
  { label: "Event", tone: "warning" as const, pos: "55%" },
  { label: "Optimization", tone: "success" as const, pos: "72%" },
  { label: "Fault", tone: "danger" as const, pos: "88%" },
];

const designTenets = [
  { label: "Supabase hover + glow", tone: "success" as const },
  { label: "WindPulse chart polish", tone: "info" as const },
  { label: "Orion infographic clarity", tone: "warning" as const },
  { label: "Sourceful energy tone", tone: "success" as const },
];

const surfaceVariants = [
  {
    title: "Base surface",
    desc: "Matte, 1px border, subtle shadow. Use for dense data.",
    style: "bg-surface border border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
  },
  {
    title: "Elevated + glow",
    desc: "Hover lift, primary edge glow for key cards.",
    style:
      "bg-surface border border-[rgba(82,183,136,0.25)] shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_18px_40px_rgba(64,145,108,0.22)]",
  },
  {
    title: "Glass / frosted",
    desc: "Translucent panel for hero/map shells.",
    style:
      "bg-[rgba(17,27,22,0.65)] backdrop-blur-md border border-white/[0.14] shadow-[0_0_0_1px_rgba(82,183,136,0.2),0_20px_48px_rgba(0,0,0,0.45)]",
  },
];

const iconStrip = [
  { label: "Building", icon: LayoutTemplate },
  { label: "HVAC", icon: Gauge },
  { label: "Pumps", icon: Droplets },
  { label: "Grid", icon: Zap },
  { label: "Alerts", icon: Flame },
  { label: "Comfort", icon: Activity },
  { label: "Map", icon: Map },
];

const paletteVariants = [
  {
    name: "Emerald + Brass",
    colors: [
      { label: "bg", hex: "#0B0F0D" },
      { label: "surface", hex: "#121814" },
      { label: "hover", hex: "#19231B" },
      { label: "primary", hex: "#2E7D5B" },
      { label: "bright", hex: "#54D79E" },
      { label: "glow", hex: "#3FA072" },
      { label: "text", hex: "#ECF6F1" },
      { label: "muted", hex: "#B8C6B8" },
      { label: "info", hex: "#5AB3FF" },
      { label: "warning", hex: "#F0C15A" },
      { label: "danger", hex: "#E36464" },
    ],
  },
  {
    name: "Petrol + Lilac",
    colors: [
      { label: "bg", hex: "#0A0E14" },
      { label: "surface", hex: "#111825" },
      { label: "hover", hex: "#182333" },
      { label: "primary", hex: "#2D6A82" },
      { label: "bright", hex: "#6EC2FF" },
      { label: "glow", hex: "#4BA0D1" },
      { label: "text", hex: "#E9EEF7" },
      { label: "muted", hex: "#A7B3C7" },
      { label: "info", hex: "#9D8CFF" },
      { label: "warning", hex: "#F4C272" },
      { label: "danger", hex: "#E27A8B" },
    ],
  },
  {
    name: "Obsidian + Mint",
    colors: [
      { label: "bg", hex: "#050807" },
      { label: "surface", hex: "#0C1210" },
      { label: "hover", hex: "#131C18" },
      { label: "primary", hex: "#2E8B72" },
      { label: "bright", hex: "#6EF0C2" },
      { label: "glow", hex: "#43C49C" },
      { label: "text", hex: "#F1FAF5" },
      { label: "muted", hex: "#A3C8B7" },
      { label: "info", hex: "#59D3E3" },
      { label: "warning", hex: "#F0C86D" },
      { label: "danger", hex: "#E56F6F" },
    ],
  },
  {
    name: "Midnight Plum",
    colors: [
      { label: "bg", hex: "#0A0710" },
      { label: "surface", hex: "#120F1A" },
      { label: "hover", hex: "#1B1725" },
      { label: "primary", hex: "#6E4FD8" },
      { label: "bright", hex: "#B48CFF" },
      { label: "glow", hex: "#8A6BF1" },
      { label: "text", hex: "#F3EEFA" },
      { label: "muted", hex: "#B7A9CC" },
      { label: "info", hex: "#6EC2FF" },
      { label: "warning", hex: "#F2C472" },
      { label: "danger", hex: "#E57A9A" },
    ],
  },
  {
    name: "Teal + Sand",
    colors: [
      { label: "bg", hex: "#0A0C0D" },
      { label: "surface", hex: "#111413" },
      { label: "hover", hex: "#181D1B" },
      { label: "primary", hex: "#1F8A89" },
      { label: "bright", hex: "#5FD4D2" },
      { label: "glow", hex: "#3FB5B4" },
      { label: "text", hex: "#F4F3EF" },
      { label: "muted", hex: "#C8C0B4" },
      { label: "info", hex: "#6AB7FF" },
      { label: "warning", hex: "#E9C17A" },
      { label: "danger", hex: "#E0796E" },
    ],
  },
  {
    name: "Sienna Slate",
    colors: [
      { label: "bg", hex: "#0B0C0F" },
      { label: "surface", hex: "#14161C" },
      { label: "hover", hex: "#1C1F27" },
      { label: "primary", hex: "#C76A4A" },
      { label: "bright", hex: "#F2A57C" },
      { label: "glow", hex: "#E88563" },
      { label: "text", hex: "#F3EFEA" },
      { label: "muted", hex: "#C5B7AE" },
      { label: "info", hex: "#7DB1D8" },
      { label: "warning", hex: "#F0C66C" },
      { label: "danger", hex: "#E16363" },
    ],
  },
];

const tabVariants = [
  {
    title: "Underline (current)",
    desc: "Minimal underline, strong focus color; best for dense data views.",
    activeClass: "text-[var(--primary-bright)]",
    pill: false,
  },
  {
    title: "Glow pill",
    desc: "Glassy pill with glow edge; use for marketing/hero sections.",
    activeClass:
      "text-[var(--primary-bright)] bg-[rgba(82,183,136,0.12)] border border-[rgba(82,183,136,0.35)] shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_30px_rgba(64,145,108,0.18)] rounded-full",
    pill: true,
  },
  {
    title: "Segmented",
    desc: "Bordered segmented control; good for mode switches (Owner/FM/Engineer).",
    activeClass:
      "text-[var(--primary-bright)] bg-surface-hover border border-[rgba(82,183,136,0.35)] shadow-[0_0_0_1px_rgba(82,183,136,0.22)]",
    pill: true,
  },
];

const fontVariants = [
  {
    title: "Plus Jakarta Sans (default)",
    desc: "Primary voice. Friendly, modern. Use tabular-nums for KPIs.",
    style: { fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif", fontFeatureSettings: "'tnum' 1" },
  },
  {
    title: "Inter (dense views)",
    desc: "Neutral & compact. Good for tables and engineering panels.",
    style: { fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif", fontFeatureSettings: "'tnum' 1" },
  },
  {
    title: "Grotesk accent (headlines)",
    desc: "Pair as accent for section headers only; keep body on Jakarta.",
    style: { fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', sans-serif", fontFeatureSettings: "'tnum' 1" },
  },
];

const hoverRecipes = [
  {
    title: "Hover glow (cards/tabs)",
    desc: "Use for primary surfaces and tabs; add 1px outline + lift.",
    className:
      "border border-white/[0.08] hover:border-[rgba(82,183,136,0.35)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_30px_rgba(64,145,108,0.2)]",
  },
  {
    title: "Icon micro-move (small targets)",
    desc: "Scale 1.05 + rotate 2°; use on icon-only buttons or list rows.",
    className: "border border-white/[0.08] hover:border-white/[0.14] hover:bg-[var(--surface-hover)]",
  },
  {
    title: "Soft focus ring (inputs)",
    desc: "Primary-tinted ring on focus without glow; keeps forms calm.",
    className: "border border-white/[0.12] focus:border-[rgba(82,183,136,0.55)] focus:ring-2 focus:ring-[rgba(82,183,136,0.25)]",
  },
];

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

function PalettePreview({ name, colors }: { name: string; colors: { label: string; hex: string }[] }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-surface-hover/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-foreground">{name}</div>
        <span className="text-[11px] text-foreground-faint">Hover to compare</span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {colors.map((c) => (
          <div
            key={c.label}
            className="h-12 rounded-md border border-white/[0.06] relative overflow-hidden group/col transition-all duration-200 hover:-translate-y-[1px] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_26px_rgba(64,145,108,0.18)]"
            style={{ background: c.hex }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-transparent to-black/22" />
            <div className="absolute bottom-1 left-1 right-1 text-[10px] text-white/85 font-medium flex justify-between">
              <span className="uppercase tracking-[0.08em]">{c.label}</span>
              <span className="font-mono">{c.hex.replace("#", "")}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CrystalTowerBlock({ tone }: { tone: "energy" | "faults" | "tenants" }) {
  const ref = useRef<any>(null);
  const toneMap = {
    energy: { main: "#6ef0c2", sub: "#59d3e3" },
    faults: { main: "#e56f6f", sub: "#f0c86d" },
    tenants: { main: "#6ec2ff", sub: "#9d8cff" },
  } as const;
  const palette = toneMap[tone];
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[1.6, 2.9, 1.2]} radius={0.06} smoothness={4} position={[0, 1.45, 0]}>
        <meshStandardMaterial color={palette.main} metalness={0.25} roughness={0.35} />
      </RoundedBox>
      <RoundedBox args={[1.2, 2.1, 1.1]} radius={0.05} smoothness={4} position={[1.15, 1.05, 0.2]}>
        <meshStandardMaterial color={palette.sub} metalness={0.2} roughness={0.45} />
      </RoundedBox>
      <RoundedBox args={[0.7, 1.5, 0.8]} radius={0.05} smoothness={4} position={[-1.2, 0.75, 0.1]}>
        <meshStandardMaterial color="#2a6b60" metalness={0.2} roughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[0.35, 3.2, 0.35]} radius={0.04} smoothness={4} position={[0.55, 1.55, -0.85]}>
        <meshStandardMaterial color="#89cfc4" metalness={0.3} roughness={0.2} />
      </RoundedBox>
      <mesh position={[0.2, 0.02, 0]}>
        <planeGeometry args={[3.2, 2.2]} />
        <meshStandardMaterial color="#0f1614" />
      </mesh>
      {[-1.05, -0.7, -0.35, 0, 0.35, 0.7, 1.05].map((x) => (
        <mesh key={x} position={[x, 0.03, 0]}>
          <boxGeometry args={[0.04, 0.02, 2.1]} />
          <meshStandardMaterial color="#20453f" />
        </mesh>
      ))}
      <RoundedBox args={[3.6, 0.15, 2.6]} radius={0.05} smoothness={4} position={[0.2, -0.15, 0]}>
        <meshStandardMaterial color="#111b16" metalness={0.1} roughness={0.8} />
      </RoundedBox>
      <Edges scale={1.02} color="rgba(82,183,136,0.55)" />
    </group>
  );
}

function IsometricStack({ activeFloor }: { activeFloor: number }) {
  const floors = [0, 1, 2, 3, 4];
  return (
    <group rotation={[-0.25, 0.45, 0]}>
      {floors.map((idx) => {
        const isActive = idx === activeFloor;
        return (
          <group key={idx}>
            <RoundedBox args={[2.2, 0.16, 1.6]} radius={0.04} smoothness={3} position={[0, idx * 0.22, 0]}>
              <meshStandardMaterial
                color={isActive ? "#6ef0c2" : "#2a6a82"}
                emissive={isActive ? "#3fa072" : "#000000"}
                emissiveIntensity={isActive ? 0.45 : 0}
                metalness={0.2}
                roughness={0.35}
              />
            </RoundedBox>
            <RoundedBox args={[0.42, 0.1, 0.28]} radius={0.03} smoothness={3} position={[0.78, idx * 0.22 + 0.1, 0]}>
              <meshStandardMaterial color={isActive ? "#9ff7d8" : "#427d8f"} emissive={isActive ? "#3fa072" : "#000000"} emissiveIntensity={isActive ? 0.25 : 0} />
            </RoundedBox>
          </group>
        );
      })}
      <RoundedBox args={[2.3, 0.12, 1.7]} radius={0.04} smoothness={3} position={[0, -0.15, 0]}>
        <meshStandardMaterial color="#0f1513" metalness={0.1} roughness={0.85} />
      </RoundedBox>
    </group>
  );
}

function MiniThreeScene({
  mode,
  activeFloor = 2,
  towerTone = "energy",
  scrollProgress = 0,
}: {
  mode: "tower" | "stack";
  activeFloor?: number;
  towerTone?: "energy" | "faults" | "tenants";
  scrollProgress?: number;
}) {
  return (
    <Canvas camera={{ position: [3.4, 2.6, 3.8], fov: 42 }}>
      <color attach="background" args={["#0c1210"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 4]} intensity={1.1} color="#c8fff0" />
      <directionalLight position={[-4, 2, -2]} intensity={0.4} color="#6cb2ff" />
      <Float speed={1.1} rotationIntensity={0.16} floatIntensity={0.08}>
        <group rotation={[0, scrollProgress * Math.PI * 2, 0]} position={[0, scrollProgress * 0.4, 0]}>
          {mode === "tower" ? <CrystalTowerBlock tone={towerTone} /> : <IsometricStack activeFloor={activeFloor} />}
        </group>
      </Float>
      <OrbitControls enablePan={false} minDistance={3.1} maxDistance={6} autoRotate autoRotateSpeed={0.45} />
    </Canvas>
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
  const [towerMode, setTowerMode] = useState<"energy" | "faults" | "tenants">("energy");
  const [activeFloor, setActiveFloor] = useState(2);
  const [scrollProgress, setScrollProgress] = useState(0);

  const sparklinePoints = useMemo(() => sparkline.map((v, i) => ({ v, i })), []);

  useEffect(() => {
    const onScroll = () => {
      const maxScrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScrollable));
      setScrollProgress(progress);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // #region agent log
  fetch("http://127.0.0.1:7249/ingest/06785e49-5708-46a4-9960-0555e92ea435", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "354bb6" },
    body: JSON.stringify({
      sessionId: "354bb6",
      runId: "build-error-investigation",
      hypothesisId: "H1",
      location: "src/app/design-lab/page.tsx:DesignLabPage",
      message: "DesignLabPage render reached",
      data: { paletteVariantsLength: paletteVariants.length, activeTab, towerMode, activeFloor },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return (
    <div
      className="p-6 md:p-8 space-y-6 max-w-[1600px] mx-auto"
      style={
        {
          "--bg": "#0A0C0D",
          "--surface": "#111413",
          "--surface-hover": "#181D1B",
          "--primary": "#1F8A89",
          "--primary-bright": "#5FD4D2",
          "--primary-soft": "#3FB5B4",
          "--text": "#F4F3EF",
          "--text-muted": "#C8C0B4",
          "--info": "#6AB7FF",
          "--warning": "#E9C17A",
          "--danger": "#E0796E",
          "--border": "rgba(255,255,255,0.08)",
        } as Record<string, string>
      }
    >
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

      <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[var(--gradient-hero)] shadow-[0_18px_60px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.22),transparent_38%),radial-gradient(circle_at_80%_40%,rgba(108,178,255,0.16),transparent_36%)]" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div className="relative grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-4 p-5 md:p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-foreground-faint">
              Design playground · side-by-side variants
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {designTenets.map((t) => (
                <StatusPill key={t.label} label={t.label} tone={t.tone} />
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
              <div className="rounded-lg border border-white/[0.08] bg-surface/80 backdrop-blur-sm p-3">
                <div className="text-foreground-muted mb-1">Palette</div>
                <div className="text-foreground font-semibold">Dark forest + matcha</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-surface/80 backdrop-blur-sm p-3">
                <div className="text-foreground-muted mb-1">Motion</div>
                <div className="text-foreground font-semibold">200–300ms ease, glow lift</div>
              </div>
              <div className="rounded-lg border border-white/[0.08] bg-surface/80 backdrop-blur-sm p-3">
                <div className="text-foreground-muted mb-1">Data viz</div>
                <div className="text-foreground font-semibold">Orion/WindPulse-grade charts</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="relative h-32 rounded-lg overflow-hidden border border-white/[0.12] bg-[rgba(17,27,22,0.65)] backdrop-blur-md shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_16px_44px_rgba(0,0,0,0.4)]">
              <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(82,183,136,0.22),transparent_40%)]" />
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[12px] text-foreground">
                <span className="font-semibold">3D shell (glass)</span>
                <span className="text-foreground-muted">Glow edge</span>
              </div>
            </div>
            <div className="relative h-32 rounded-lg overflow-hidden border border-white/[0.12] bg-surface shadow-[0_0_0_1px_rgba(82,183,136,0.18),0_16px_44px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.12),transparent_32%),radial-gradient(circle_at_75%_30%,rgba(108,178,255,0.12),transparent_28%)]" />
              <div className="absolute top-2 right-2 flex items-center gap-2 text-[11px] text-foreground-muted">
                <Map className="w-4 h-4" />
                <span>Layer toggles</span>
              </div>
              <div className="absolute inset-0 flex items-end p-3">
                <div className="text-foreground font-semibold text-sm">Map frame (dark)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Navigation & active states"
          description="Glassier active pill with glow trail vs baseline; icons get micro motion."
          badge="Nav"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/[0.08] bg-surface-hover/60 p-4">
              <div className="text-[12px] text-foreground-faint mb-2 uppercase tracking-[0.14em]">Baseline</div>
              <div className="space-y-2 text-[13px]">
                <div className="flex items-center justify-between px-3 py-2 rounded-md bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)] font-semibold">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Design Lab
                  </div>
                  <span className="text-[11px] text-foreground-faint">Flat fill</span>
                </div>
                <div className="px-3 py-2 rounded-md text-foreground-muted hover:bg-[var(--surface-hover)] border border-transparent transition-all duration-200">
                  Hover state — soft surface
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-[rgba(82,183,136,0.25)] bg-[rgba(17,27,22,0.7)] backdrop-blur-md p-4 shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_16px_40px_rgba(64,145,108,0.18)]">
              <div className="text-[12px] text-foreground-faint mb-2 uppercase tracking-[0.14em]">Glassy + glow</div>
              <div className="space-y-2 text-[13px]">
                <div className="relative overflow-hidden flex items-center justify-between px-3 py-2 rounded-md text-[var(--primary-bright)] font-semibold border border-[rgba(82,183,136,0.35)] shadow-[0_0_0_1px_rgba(82,183,136,0.3),0_16px_38px_rgba(64,145,108,0.22)]">
                  <div className="absolute inset-[-30%] bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.25),transparent_55%)] opacity-80" />
                  <div className="relative flex items-center gap-2">
                    <Sparkles className="w-4 h-4 drop-shadow-[0_0_8px_rgba(82,183,136,0.6)]" />
                    Design Lab (active)
                  </div>
                  <span className="relative text-[11px] text-foreground-faint">Glassy + border</span>
                </div>
                <div className="px-3 py-2 rounded-md text-foreground-muted border border-white/[0.08] hover:border-[rgba(82,183,136,0.35)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_28px_rgba(64,145,108,0.16)] transition-all duration-200">
                  Hover adds outline + lift
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Surface tiers (base / elevated / glass)"
          description="Three tiers to avoid monotony; glass reserved for hero/map/3D shells."
          badge="Surfaces"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {surfaceVariants.map((variant) => (
              <div key={variant.title} className={cn("rounded-lg p-4 transition-all duration-200", variant.style)}>
                <div className="text-sm font-semibold text-foreground">{variant.title}</div>
                <div className="text-[12px] text-foreground-muted mt-1 leading-relaxed">{variant.desc}</div>
                <div className="mt-3 h-10 rounded-md bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[11px] text-foreground-faint">
                  Content slot
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Tabs & filters variants"
          description="Pick a style per context: minimal underline for data; glow pills for hero; segmented for modes."
          badge="Navigation"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {tabVariants.map((tab) => (
              <div key={tab.title} className="rounded-lg border border-white/[0.08] bg-surface-hover/60 p-4 space-y-3">
                <div className="text-sm font-semibold text-foreground">{tab.title}</div>
                <div className="text-[12px] text-foreground-muted leading-relaxed">{tab.desc}</div>
                <div
                  className={cn(
                    "flex items-center gap-2 text-[13px] px-2 py-1 rounded-md border border-white/[0.08] bg-surface",
                    tab.pill && "rounded-full justify-between"
                  )}
                >
                  <button
                    className={cn(
                      "px-2.5 py-1.5 transition-all duration-200",
                      tab.pill ? "rounded-full" : "relative",
                      tab.activeClass
                    )}
                  >
                    OVERVIEW
                  </button>
                  <button className={cn("px-2.5 py-1.5 text-foreground-faint transition-colors duration-200", tab.pill && "rounded-full hover:text-foreground hover:bg-[var(--surface-hover)]")}>
                    KPIS
                  </button>
                  <button className={cn("px-2.5 py-1.5 text-foreground-faint transition-colors duration-200", tab.pill && "rounded-full hover:text-foreground hover:bg-[var(--surface-hover)]")}>
                    ENG
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Typography pairings"
          description="Mix-and-match within the lab: keep body on Jakarta, use alternates sparingly."
          badge="Type"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {fontVariants.map((font) => (
              <div key={font.title} className="rounded-lg border border-white/[0.08] bg-surface-hover/60 p-4 space-y-2" style={font.style}>
                <div className="text-sm font-semibold text-foreground">{font.title}</div>
                <div className="text-[12px] text-foreground-muted leading-relaxed">{font.desc}</div>
                <div className="text-lg font-semibold text-foreground">Energy Intensity 84.2</div>
                <div className="text-[12px] text-foreground-muted">Δ -6.4% vs baseline · tabular nums</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Hover recipes — where to use what"
        description="Apply the right micro-interaction per component type to avoid visual noise."
        badge="Motion Map"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {hoverRecipes.map((recipe) => (
            <div key={recipe.title} className={cn("rounded-lg bg-surface p-4 transition-all duration-200", recipe.className)}>
              <div className="text-sm font-semibold text-foreground mb-1">{recipe.title}</div>
              <div className="text-[12px] text-foreground-muted leading-relaxed">{recipe.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Iconography + illustration rhythm"
        description="Breathing space between data-heavy blocks; icons carry micro-motion and consistent stroke; illustration slots carry brand stories."
        badge="Visual"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-4">
          <div className="rounded-lg border border-white/[0.08] bg-surface-hover/60 p-4">
            <div className="text-[12px] text-foreground-faint uppercase tracking-[0.14em] mb-3">Icon strip</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {iconStrip.map((item) => (
                <div
                  key={item.label}
                  className="group flex flex-col items-center justify-center gap-2 p-3 rounded-md border border-white/[0.08] bg-surface hover:border-[rgba(82,183,136,0.35)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_12px_26px_rgba(64,145,108,0.18)] transition-all duration-200"
                >
                  <item.icon className="w-5 h-5 text-[var(--primary-bright)] group-hover:scale-110 group-hover:-translate-y-[1px] transition-transform duration-200" />
                  <span className="text-[11px] text-foreground-faint">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-lg overflow-hidden border border-white/[0.1] bg-[radial-gradient(circle_at_30%_30%,rgba(82,183,136,0.24),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(108,178,255,0.2),transparent_45%),#0E1512] shadow-[0_0_0_1px_rgba(82,183,136,0.2),0_18px_42px_rgba(0,0,0,0.4)] min-h-[200px]">
            <div className="absolute inset-0 opacity-16" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
            <div className="absolute inset-0 grid grid-cols-2 divide-x divide-white/5">
              <div className="flex items-center justify-center p-4">
                <img src="https://images.unsplash.com/photo-1505842679544-9e88a598e230?auto=format&fit=crop&w=400&q=80" alt="Skyline render" className="w-full h-full object-cover opacity-90 mix-blend-screen" />
              </div>
              <div className="flex flex-col items-center justify-center gap-2 p-4">
                <img src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80" alt="Low-poly block" className="w-full h-24 object-cover rounded-md border border-white/10" />
                <img src="https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=400&q=80" alt="Isometric stack" className="w-full h-24 object-cover rounded-md border border-white/10" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[12px] text-foreground">
              <span className="font-semibold">Illustration & render samples</span>
              <span className="text-foreground-muted">Swap to curated assets as needed</span>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Charts with annotations & scrub"
        description="Inline labels > legends; before/after scrub hint; event markers for credibility."
        badge="Data Viz — Experiments"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr,1fr] gap-4">
          <div className="relative bg-surface-hover/60 border border-white/[0.08] rounded-lg p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Load vs Baseline (annotated)</div>
                <div className="text-[11px] text-foreground-faint">Event tags replace bulky legends</div>
              </div>
              <StatusPill label="Infographic style" tone="info" />
            </div>
            <div className="h-[220px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={lineData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="area-fill-annotated" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#52b788" stopOpacity={0.45} />
                      <stop offset="100%" stopColor="#52b788" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
                  <Line type="monotone" dataKey="baseline" name="Baseline" stroke="#2d6a4f" strokeWidth={2.2} dot={false} strokeDasharray="4 3" />
                  <Area
                    type="monotone"
                    dataKey="actual"
                    name="Actual"
                    stroke="#52b788"
                    strokeWidth={2.6}
                    fill="url(#area-fill-annotated)"
                    dot={{ r: 2, fill: "#52b788" }}
                    isAnimationActive={false}
                    style={{ filter: "drop-shadow(0 0 6px rgba(82,183,136,0.5))" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="absolute top-10 left-16 text-[11px] px-2 py-1 rounded-full bg-[rgba(82,183,136,0.14)] border border-[rgba(82,183,136,0.35)] text-[var(--primary-bright)] shadow-[0_0_0_1px_rgba(82,183,136,0.25)]">
                Optimization ON
              </div>
              <div className="absolute bottom-8 right-16 text-[11px] px-2 py-1 rounded-full bg-[rgba(229,115,115,0.12)] border border-[rgba(229,115,115,0.35)] text-[var(--danger)] shadow-[0_0_0_1px_rgba(229,115,115,0.25)]">
                Fault detected
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-white/[0.08] bg-surface p-4">
              <div className="text-[12px] text-foreground-faint uppercase tracking-[0.14em] mb-2">Before / After scrub</div>
              <div className="relative h-28 rounded-md overflow-hidden border border-white/[0.06] bg-surface-hover">
                <div className="absolute inset-y-0 left-1/2 w-[2px] bg-[var(--primary-bright)] shadow-[0_0_0_1px_rgba(82,183,136,0.35)]" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(82,183,136,0.08)50%,rgba(255,255,255,0.02)50%)]" />
                <div className="absolute top-3 left-3 text-[11px] text-foreground-muted">Before</div>
                <div className="absolute top-3 right-3 text-[11px] text-foreground-muted">After</div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-foreground">
                  <span>Energy Intensity</span>
                  <span className="text-[var(--primary-bright)] font-semibold">-9.4%</span>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-surface p-4 space-y-2">
              <div className="text-[12px] text-foreground-faint uppercase tracking-[0.14em]">Event river (teaser)</div>
              <div className="h-20 rounded-md border border-white/[0.06] bg-[radial-gradient(circle_at_30%_50%,rgba(82,183,136,0.12),transparent_40%),radial-gradient(circle_at_70%_40%,rgba(229,115,115,0.12),transparent_38%)] flex items-center justify-center text-[12px] text-foreground-muted">
                Fault timeline with cost-of-inaction markers
              </div>
              <div className="flex gap-2">
                <StatusPill label="Event" tone="warning" />
                <StatusPill label="Optimization" tone="success" />
                <StatusPill label="Fault" tone="danger" />
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

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

      <SectionCard
        title="Palette experiments"
        description="Winner applied across this page: Teal + Sand. Prior options are restored below for reference."
        badge="Winner"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {paletteVariants.map((variant) => (
            <PalettePreview key={variant.name} name={variant.name} colors={variant.colors} />
          ))}
        </div>
      </SectionCard>

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
          title="Panel / Drawer variants"
          description="Pick a shell: A glassy edge, B sleek matte, C info-heavy with stats strip."
          badge="Pattern"
        >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="relative rounded-lg overflow-hidden border border-[rgba(82,183,136,0.28)] bg-[rgba(17,27,22,0.72)] backdrop-blur-lg shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_16px_44px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
              <div className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-[rgba(82,183,136,0.28)] bg-[rgba(17,27,22,0.8)] backdrop-blur-md">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-foreground-faint">A · Glassy edge</div>
                  <div className="text-sm font-semibold text-foreground">Chiller plant — Off-peak tuning</div>
                </div>
                <StatusPill label="Active" tone="success" />
              </div>
              <div className="p-4 space-y-3 text-[13px] text-foreground-muted max-h-52 overflow-auto">
                <div className="flex items-center gap-2 text-foreground">
                  <Gauge className="w-4 h-4 text-[var(--primary-bright)]" />
                  Target COP > 6.1 (current 6.4)
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-[var(--info)]" />
                  Condenser water reset based on wet-bulb
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[var(--warning)]" />
                  Watchlist: Boiler-01 cycling — suggest PID tune
                </div>
                <div className="border border-white/[0.12] rounded-md p-3 text-foreground bg-[rgba(17,27,22,0.6)]">
                  <div className="text-[12px] text-foreground-faint mb-1">Notes</div>
                  Glass edge, grid overlay, sticky header/footer.
                </div>
              </div>
              <div className="sticky bottom-0 flex items-center justify-between gap-2 px-4 py-3 border-t border-[rgba(82,183,136,0.28)] bg-[rgba(17,27,22,0.8)] backdrop-blur-md">
                <button className="text-[13px] text-foreground-muted px-3 py-2 rounded-md border border-white/[0.12] hover:border-white/[0.18] transition-colors">
                  Dismiss
                </button>
                <button className="text-[13px] font-semibold px-4 py-2 rounded-md bg-[var(--primary)] text-white border border-white/[0.12] shadow-[0_0_0_1px_rgba(82,183,136,0.35),0_12px_32px_rgba(64,145,108,0.25)] hover:-translate-y-[1px] transition-all duration-200">
                  Apply change
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.08] bg-surface-hover shadow-[0_10px_26px_rgba(0,0,0,0.28)] flex flex-col">
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-foreground-faint">B · Sleek matte</div>
                  <div className="text-sm font-semibold text-foreground">Owner / FM / Engineer</div>
                </div>
                <div className="flex gap-1">
                  <StatusPill label="Owner" tone="success" />
                  <StatusPill label="FM" tone="info" />
                </div>
              </div>
              <div className="p-4 space-y-2 text-[13px] text-foreground-muted flex-1">
                Thin border, no glow; keep it calm. Use for productivity panels.
              </div>
              <div className="px-4 py-3 border-t border-white/[0.06] flex items-center justify-between">
                <button className="px-3 py-2 rounded-full border border-white/[0.12] text-[13px] text-foreground-muted">
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-full border border-[rgba(82,183,136,0.35)] text-[13px] text-[var(--primary-bright)]">
                  Save
                </button>
              </div>
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

      <SectionCard
        title="Charts — variants gallery"
        description="Try multiple data-viz styles side-by-side: inline labels, donut callouts, scrub, heatmap, event river."
        badge="Data Viz Lab"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <div className="bg-surface-hover/60 border border-white/[0.08] rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Bar with inline labels</div>
                <div className="text-[11px] text-foreground-faint">Labels on bars; no legend box</div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barInlineData} margin={{ left: 0, right: 10 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Bar dataKey="saving" radius={[4, 4, 4, 4]} fill="url(#bar-fill-inline)">
                    <defs>
                      <linearGradient id="bar-fill-inline" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#52b788" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="#52b788" stopOpacity={0.45} />
                      </linearGradient>
                    </defs>
                    {barInlineData.map((entry, idx) => (
                      <Cell key={entry.name} fillOpacity={0.9 - idx * 0.05} />
                    ))}
                    <LabelList dataKey="saving" position="right" offset={12} fill="#E8F5E9" formatter={(v: number) => `${v} kWh`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface-hover/60 border border-white/[0.08] rounded-md p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-foreground">Donut + callouts</div>
                <div className="text-[11px] text-foreground-faint">Outer labels with leader lines</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-28 h-28 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" nameKey="name" innerRadius={32} outerRadius={50} stroke="rgba(255,255,255,0.12)" paddingAngle={2}>
                      {donutData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-xs text-foreground-faint">Mix</div>
                    <div className="text-sm font-semibold text-foreground">100%</div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-2 text-[12px] text-foreground">
                {donutData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                    <span className="font-semibold">{d.name}</span>
                    <span className="text-foreground-muted">{d.value}%</span>
                  </div>
                ))}
                <div className="text-[11px] text-[var(--danger)]">Storage slice tinted coral when in fault.</div>
              </div>
            </div>
          </div>

          <div className="bg-surface-hover/60 border border-white/[0.08] rounded-md p-4">
            <div className="text-sm font-semibold text-foreground mb-2">Before / After scrub v2</div>
            <div className="relative h-32 rounded-md overflow-hidden border border-white/[0.08] bg-surface">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(90deg, rgba(82,183,136,0.08) 50%, rgba(255,255,255,0.02) 50%)" }} />
              <div className="absolute inset-y-0 left-1/2 w-[3px] bg-[var(--primary-bright)] shadow-[0_0_0_1px_rgba(82,183,136,0.35)]" />
              <div className="absolute top-2 left-3 text-[11px] text-foreground-muted">Before</div>
              <div className="absolute top-2 right-3 text-[11px] text-foreground-muted">After</div>
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[12px] text-foreground">
                <span>Energy Intensity</span>
                <span className="text-[var(--primary-bright)] font-semibold">-9.4%</span>
              </div>
              <div className="absolute inset-y-4 left-1/2 -ml-4 w-8 rounded-full border border-white/[0.12] bg-surface-hover flex items-center justify-center text-[11px] text-foreground-muted">
                ⇆
              </div>
            </div>
          </div>

          <div className="bg-surface-hover/60 border border-white/[0.08] rounded-md p-4">
            <div className="text-sm font-semibold text-foreground mb-2">Heatmap mini</div>
            <div className="grid grid-cols-12 gap-[3px]">
              {heatmapData.map((row, rIdx) =>
                row.map((v, cIdx) => {
                  const pct = (v - 22) / 80;
                  const col = `rgba(82,183,136,${0.18 + pct * 0.55})`;
                  return <div key={`${rIdx}-${cIdx}`} className="h-5 rounded-sm" style={{ background: col }} title={`${v.toFixed(0)} units`} />;
                })
              )}
            </div>
            <div className="text-[11px] text-foreground-faint mt-2">Narrow green ramp; add tooltip for exact values.</div>
          </div>

          <div className="bg-surface-hover/60 border border-white/[0.08] rounded-md p-4">
            <div className="text-sm font-semibold text-foreground mb-2">Event river</div>
            <div className="relative h-24 rounded-md border border-white/[0.08] bg-surface">
              <div className="absolute left-3 right-3 top-1/2 h-[2px] bg-white/[0.08]" />
              {eventRiver.map((ev) => (
                <div
                  key={ev.pos}
                  className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-full text-[11px] border"
                  style={{ left: ev.pos }}
                >
                  <StatusPill label={ev.label} tone={ev.tone as any} />
                </div>
              ))}
            </div>
            <div className="text-[11px] text-foreground-faint mt-2">Markers align to timeline; add cost labels/tooltips.</div>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <SectionCard
          title="Density & spacing lab"
          description="Toggle between standard and dense to prove adaptability without token changes."
          badge="Layout"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-white/[0.08] bg-surface p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-foreground">Standard</div>
                <StatusPill label="Comfort" tone="info" />
              </div>
              <p className="text-[12px] text-foreground-muted leading-relaxed">
                16–20px padding, relaxed line-height, more negative space for presentations.
              </p>
              <div className="space-y-2">
                <div className="rounded-md border border-white/[0.06] bg-surface-hover px-3 py-2 text-sm text-foreground">
                  Card content — breathing room
                </div>
                <div className="rounded-md border border-white/[0.06] bg-surface-hover px-3 py-2 text-sm text-foreground">
                  KPI row — 52px chart slot
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-white/[0.12] bg-surface-hover/70 p-3 space-y-2 shadow-[0_0_0_1px_rgba(82,183,136,0.2),0_14px_30px_rgba(64,145,108,0.16)]">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-foreground">Dense</div>
                <StatusPill label="-14% height" tone="warning" />
              </div>
              <p className="text-[12px] text-foreground-muted leading-relaxed">
                10–12px padding, compressed spacing; tables/cards stay legible.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-white/[0.08] bg-surface px-2.5 py-2 text-[12px] text-foreground">
                  Row A — 38px
                </div>
                <div className="rounded-md border border-white/[0.08] bg-surface px-2.5 py-2 text-[12px] text-foreground">
                  Row B — 38px
                </div>
                <div className="rounded-md border border-white/[0.08] bg-surface px-2.5 py-2 text-[12px] text-foreground">
                  Row C — 38px
                </div>
                <div className="rounded-md border border-white/[0.08] bg-surface px-2.5 py-2 text-[12px] text-foreground">
                  Row D — 38px
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

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

        <SectionCard
          title="3D micro blocks + 1960s tower slot"
          description="Live R3F studies: stylized tower massing, isometric floor stack, and an interactive 1960s tower concept."
          badge="3D"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative rounded-lg border border-white/[0.1] bg-surface shadow-[0_0_0_1px_rgba(82,183,136,0.22),0_14px_36px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(82,183,136,0.2), transparent 35%), radial-gradient(circle at 80% 50%, rgba(108,178,255,0.2), transparent 35%)" }} />
              <div className="p-3 space-y-2">
                <div className="text-sm font-semibold text-foreground">Low-poly block</div>
                <div className="aspect-[4/3] w-full rounded-md border border-white/[0.08] overflow-hidden">
                  <MiniThreeScene mode="tower" towerTone="energy" />
                </div>
                <div className="text-[12px] text-foreground-muted">Use as ambient 3D motif; hover parallax optional.</div>
              </div>
            </div>

            <div className="relative rounded-lg border border-white/[0.1] bg-surface shadow-[0_0_0_1px_rgba(82,183,136,0.22),0_14px_36px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="p-3 space-y-2">
                <div className="text-sm font-semibold text-foreground">Isometric floor stack</div>
                <div className="aspect-[4/3] w-full rounded-md border border-white/[0.08] overflow-hidden">
                  <MiniThreeScene mode="stack" activeFloor={activeFloor} />
                </div>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveFloor(idx)}
                      className={cn(
                        "text-[11px] px-2 py-1 rounded-md border transition-all duration-200",
                        activeFloor === idx
                          ? "border-[rgba(82,183,136,0.35)] bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)]"
                          : "border-white/[0.1] text-foreground-muted hover:text-foreground"
                      )}
                    >
                      F{idx + 1}
                    </button>
                  ))}
                </div>
                <div className="text-[12px] text-foreground-muted">Good for mode chips per floor or layer toggles.</div>
              </div>
            </div>

            <div className="relative rounded-lg border border-white/[0.1] bg-surface shadow-[0_0_0_1px_rgba(82,183,136,0.22),0_14px_36px_rgba(0,0,0,0.4)] overflow-hidden">
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, rgba(82,183,136,0.25), transparent 40%)" }} />
              <div className="p-3 space-y-2">
                <div className="text-sm font-semibold text-foreground">1960s tower slot</div>
                <div className="text-[12px] text-foreground-muted">Sketchfab import (approved model) + mode chips for design state planning.</div>
                <div className="aspect-[3/4] rounded-md border border-[rgba(82,183,136,0.3)] bg-[rgba(17,27,22,0.75)] overflow-hidden">
                  <iframe
                    title="Generic 1960s Office Skyscraper"
                    src="https://sketchfab.com/models/b69b0982f94644e297eee31d9e06ceff/embed?autostart=1&preload=1&ui_infos=0&ui_hint=0"
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
                <div className="flex gap-1">
                  {(["energy", "faults", "tenants"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setTowerMode(mode)}
                      className={cn(
                        "text-[11px] px-2 py-1 rounded-full border transition-all duration-200",
                        towerMode === mode
                          ? "border-[rgba(82,183,136,0.35)] bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)]"
                          : "border-white/[0.1] text-foreground-muted hover:text-foreground"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
                <div className="text-[12px] text-foreground">
                  Mode chips selected: <span className="text-[var(--primary-bright)] font-semibold">{towerMode}</span>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Illustration & Render Gallery"
        description="Curated architectural 2D/3D sources for production-quality assets (not placeholders)."
        badge="Assets"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          <a
            href="https://sketchfab.com/3d-models/generic-1960s-office-skyscraper-b69b0982f94644e297eee31d9e06ceff"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-[rgba(82,183,136,0.28)] bg-[rgba(17,27,22,0.7)] backdrop-blur-md p-4 shadow-[0_0_0_1px_rgba(82,183,136,0.22),0_14px_36px_rgba(0,0,0,0.35)] hover:-translate-y-[1px] transition-all"
          >
            <div className="h-36 rounded-md overflow-hidden border border-white/[0.1] mb-3">
              <iframe
                title="1960s skyscraper preview"
                src="https://sketchfab.com/models/b69b0982f94644e297eee31d9e06ceff/embed?autostart=1&preload=1&ui_infos=0&ui_hint=0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="text-sm font-semibold text-foreground">1960s Office Skyscraper</div>
            <div className="text-[12px] text-foreground-muted mt-1">Sketchfab · CC Attribution · 45.9k tris</div>
            <div className="text-[11px] text-[var(--primary-bright)] mt-3">Primary approved tower candidate</div>
          </a>

          <a
            href="https://sketchfab.com/3d-models/modern-office-building-01507e5a0aac46a5ba816aa07fe1287c"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/[0.1] bg-surface p-4 hover:border-[rgba(82,183,136,0.35)] transition-all"
          >
            <div className="h-36 rounded-md overflow-hidden border border-white/[0.1] mb-3">
              <iframe
                title="Modern office preview"
                src="https://sketchfab.com/models/01507e5a0aac46a5ba816aa07fe1287c/embed?autostart=1&preload=1&ui_infos=0&ui_hint=0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="text-sm font-semibold text-foreground">Modern Office Building</div>
            <div className="text-[12px] text-foreground-muted mt-1">Sketchfab · CC Attribution</div>
            <div className="text-[11px] text-foreground-faint mt-3">Alternative tower form</div>
          </a>

          <a
            href="https://sketchfab.com/3d-models/modern-office-building-2-0db8c4c76bb942309201477b7d64f184"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/[0.1] bg-surface p-4 hover:border-[rgba(82,183,136,0.35)] transition-all"
          >
            <div className="h-36 rounded-md overflow-hidden border border-white/[0.1] mb-3">
              <iframe
                title="Modern office 2 preview"
                src="https://sketchfab.com/models/0db8c4c76bb942309201477b7d64f184/embed?autostart=1&preload=1&ui_infos=0&ui_hint=0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <div className="text-sm font-semibold text-foreground">Modern Office Building 2</div>
            <div className="text-[12px] text-foreground-muted mt-1">Sketchfab · CC Attribution · low poly</div>
            <div className="text-[11px] text-foreground-faint mt-3">Good for realtime floor highlighting</div>
          </a>

          <a
            href="https://kenney.nl/assets/isometric-city"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/[0.1] bg-surface p-4 hover:border-[rgba(82,183,136,0.35)] transition-all"
          >
            <div className="h-36 rounded-md border border-white/[0.1] bg-[radial-gradient(circle_at_20%_20%,rgba(95,212,210,0.24),transparent_35%),#121615] mb-3 p-3">
              <svg viewBox="0 0 220 100" className="w-full h-full">
                <rect x="10" y="58" width="42" height="30" fill="#1f8a89" />
                <rect x="58" y="44" width="36" height="44" fill="#3fb5b4" />
                <rect x="100" y="50" width="54" height="38" fill="#2b7f7e" />
                <rect x="160" y="36" width="30" height="52" fill="#5fd4d2" />
                <rect x="8" y="88" width="204" height="4" fill="#c8c0b4" />
              </svg>
            </div>
            <div className="text-sm font-semibold text-foreground">Isometric City Pack</div>
            <div className="text-[12px] text-foreground-muted mt-1">Kenney · CC0 2D city kit</div>
            <div className="text-[11px] text-foreground-faint mt-3">Use for dashboard decorative motifs</div>
          </a>

          <a
            href="https://www.npmjs.com/package/@streetmix/illustrations?activeTab=readme"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/[0.1] bg-surface p-4 hover:border-[rgba(82,183,136,0.35)] transition-all"
          >
            <div className="text-sm font-semibold text-foreground">Streetmix Illustrations</div>
            <div className="text-[12px] text-foreground-muted mt-1">Open-source SVG urban assets</div>
            <div className="text-[11px] text-foreground-faint mt-3">Perfect for 2D urban planning overlays</div>
          </a>

          <a
            href="https://polyhaven.com/models/buildings"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/[0.1] bg-surface p-4 hover:border-[rgba(82,183,136,0.35)] transition-all"
          >
            <div className="text-sm font-semibold text-foreground">Poly Haven Buildings</div>
            <div className="text-[12px] text-foreground-muted mt-1">CC0 3D models / materials</div>
            <div className="text-[11px] text-foreground-faint mt-3">Use for physically based environment assets</div>
          </a>

          <a
            href="https://kitbash3d.com/products/manhattan/multimedia-building"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/[0.1] bg-surface p-4 hover:border-[rgba(82,183,136,0.35)] transition-all"
          >
            <div className="text-sm font-semibold text-foreground">KitBash Manhattan</div>
            <div className="text-[12px] text-foreground-muted mt-1">Premium city kit (NYC style)</div>
            <div className="text-[11px] text-foreground-faint mt-3">High-end option for hero renders</div>
          </a>

          <a
            href="https://kitbash3d.com/products/neo-nyc/residential-building-f"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/[0.1] bg-surface p-4 hover:border-[rgba(82,183,136,0.35)] transition-all"
          >
            <div className="text-sm font-semibold text-foreground">KitBash NEO NYC</div>
            <div className="text-[12px] text-foreground-muted mt-1">Premium futuristic+art-deco</div>
            <div className="text-[11px] text-foreground-faint mt-3">For divergent moodboard directions</div>
          </a>
        </div>
      </SectionCard>

      <SectionCard
        title="Scroll-driven 3D concept"
        description="Prototype for cinematic websites: model transforms with page scroll depth."
        badge="Motion + 3D"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr,1fr] gap-4">
          <div className="rounded-lg overflow-hidden border border-[rgba(95,212,210,0.35)] bg-[rgba(17,20,19,0.72)] backdrop-blur-md shadow-[0_0_0_1px_rgba(95,212,210,0.25),0_16px_44px_rgba(0,0,0,0.45)]">
            <div
              className="h-[360px] transition-transform duration-200 will-change-transform"
              style={{
                transform: `perspective(1200px) rotateX(${(scrollProgress - 0.5) * -8}deg) rotateY(${(scrollProgress - 0.5) * 18}deg) scale(${1 + scrollProgress * 0.08}) translateY(${scrollProgress * -12}px)`,
              }}
            >
              <iframe
                title="Scroll-driven 1960s tower"
                src="https://sketchfab.com/models/b69b0982f94644e297eee31d9e06ceff/embed?autostart=1&preload=1&ui_infos=0&ui_hint=0"
                allow="autoplay; fullscreen; xr-spatial-tracking"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="space-y-3">
            <div className="rounded-lg border border-white/[0.1] bg-surface p-4">
              <div className="text-sm font-semibold text-foreground">Scroll sync</div>
              <div className="text-[12px] text-foreground-muted mt-1">
                The tower rotates and lifts with scroll progress to simulate high-end narrative product sites.
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div className="h-full bg-[var(--primary-bright)]" style={{ width: `${Math.round(scrollProgress * 100)}%` }} />
              </div>
              <div className="text-[11px] text-foreground-faint mt-1">Progress: {Math.round(scrollProgress * 100)}%</div>
            </div>
            <div className="rounded-lg border border-white/[0.1] bg-surface p-4">
              <div className="text-sm font-semibold text-foreground">Mode tint</div>
              <div className="text-[12px] text-foreground-muted mt-1">Energy/Faults/Tenants currently selected: {towerMode}</div>
              <div className="flex gap-1 mt-2">
                {(["energy", "faults", "tenants"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTowerMode(mode)}
                    className={cn(
                      "text-[11px] px-2 py-1 rounded-full border transition-all duration-200",
                      towerMode === mode
                        ? "border-[rgba(95,212,210,0.35)] bg-[rgba(95,212,210,0.12)] text-[var(--primary-bright)]"
                        : "border-white/[0.1] text-foreground-muted hover:text-foreground"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Experimental lane (contained)"
        description="Test bolder gradients, glass, and neon here without touching core tokens."
        badge="Labs"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative rounded-lg overflow-hidden border border-[rgba(82,183,136,0.3)] bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.22),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(108,178,255,0.2),transparent_32%)] shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_18px_44px_rgba(0,0,0,0.4)] p-4">
            <div className="text-sm font-semibold text-foreground mb-1">Neon gradient</div>
            <div className="text-[12px] text-foreground-muted">Hero-only; cap opacity to keep data legible.</div>
          </div>
          <div className="rounded-lg border border-white/[0.12] bg-[rgba(17,27,22,0.65)] backdrop-blur-md p-4 shadow-[0_0_0_1px_rgba(82,183,136,0.22),0_18px_44px_rgba(0,0,0,0.42)]">
            <div className="text-sm font-semibold text-foreground mb-1">Glass morph</div>
            <div className="text-[12px] text-foreground-muted">
              Use for overlays (map controls, mini panels). Avoid tables.
            </div>
          </div>
          <div className="rounded-lg border border-[rgba(229,115,115,0.35)] bg-[rgba(229,115,115,0.12)] p-4 shadow-[0_0_0_1px_rgba(229,115,115,0.25),0_18px_44px_rgba(0,0,0,0.35)]">
            <div className="text-sm font-semibold text-foreground mb-1">Danger accent</div>
            <div className="text-[12px] text-foreground-muted">
              Reserve for alerts/faults; keep charts on greens/teals.
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
