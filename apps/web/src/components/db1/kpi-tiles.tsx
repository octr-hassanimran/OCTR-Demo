"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type KPIItem =
  | {
      title: string;
      value: string | number;
      unit?: string;
      delta: number;
      deltaLabel: string;
      sparkline: number[];
      type: "sparkline";
    }
  | {
      title: string;
      value: number;
      gaugeValue: number;
      delta: number;
      deltaLabel: string;
      type: "gauge";
    }
  | {
      title: string;
      value: string | number;
      subtitle: string;
      trafficLight: "green" | "amber" | "red";
      delta: number;
      deltaLabel: string;
      type: "traffic";
    };

const kpiData: KPIItem[] = [
  {
    title: "Energy Saved",
    value: 42.5,
    unit: "MWh",
    delta: 3.2,
    deltaLabel: "+3.2% vs last month",
    sparkline: [62, 66, 71, 74, 72, 79, 83],
    type: "sparkline",
  },
  {
    title: "Cost Saved",
    value: 4.2,
    unit: "M USD",
    delta: 4.0,
    deltaLabel: "+4.0% MoM",
    sparkline: [38, 42, 40, 44, 46, 48, 52],
    type: "sparkline",
  },
  {
    title: "CO₂e Reduced YTD",
    value: 128.4,
    unit: "tCO₂e",
    delta: 18.5,
    deltaLabel: "+18.5 this month",
    sparkline: [14, 16, 20, 22, 19, 24, 28],
    type: "sparkline",
  },
  {
    title: "System Health",
    value: 87,
    gaugeValue: 87,
    delta: 4,
    deltaLabel: "+4 pts vs last month",
    type: "gauge",
  },
  {
    title: "Fault Status",
    value: "OK",
    subtitle: "0 critical · 3 warning",
    trafficLight: "green",
    delta: 0,
    deltaLabel: "Live monitors",
    type: "traffic",
  },
  {
    title: "Optimization Mode",
    value: "Auto-Pilot",
    subtitle: "Chiller plant + AHUs",
    trafficLight: "amber",
    delta: 0,
    deltaLabel: "Live controls",
    type: "traffic",
  },
];

function Sparkline({ data, id }: { data: number[]; id: string }) {
  const points = data.map((v, i) => ({ v, i }));
  return (
    <ResponsiveContainer width="100%" height={36}>
      <AreaChart data={points} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#52b788" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#52b788" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Tooltip
          contentStyle={{
            background: "rgba(17,27,22,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
          }}
          itemStyle={{ fontSize: 11 }}
        />
        <Area
          type="monotone"
          dataKey="v"
          stroke="#52b788"
          fill={`url(#spark-${id})`}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function GaugeArc({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(value / max, 1);
  const totalAngle = 240;
  const startAngle = 150;
  const radius = 26;
  const cx = 34;
  const cy = 30;
  const strokeW = 5;

  function polarToCart(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  }

  function arcPath(start: number, end: number) {
    const s = polarToCart(start);
    const e = polarToCart(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  return (
    <svg viewBox="0 0 68 44" className="w-[68px] h-[44px]">
      <path
        d={arcPath(startAngle, startAngle + totalAngle)}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      <path
        d={arcPath(startAngle, startAngle + totalAngle * pct)}
        fill="none"
        stroke="#52b788"
        strokeWidth={strokeW}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 4px rgba(82,183,136,0.5))" }}
      />
      <text
        x={cx}
        y={cy + 4}
        textAnchor="middle"
        fill="#e8f5e9"
        fontSize="13"
        fontWeight="700"
        fontFamily="inherit"
      >
        {value}
      </text>
    </svg>
  );
}

function TrafficLight({ status }: { status: "green" | "amber" | "red" }) {
  const colors = { green: "#52b788", amber: "#f6c344", red: "#e57373" };
  return (
    <div className="flex items-center gap-1.5">
      {(["green", "amber", "red"] as const).map((c) => (
        <div
          key={c}
          className="w-2.5 h-2.5 rounded-full transition-all"
          style={{
            backgroundColor: c === status ? colors[c] : "rgba(255,255,255,0.06)",
            boxShadow: c === status ? `0 0 8px ${colors[c]}80` : "none",
          }}
        />
      ))}
    </div>
  );
}

function KPICard({ kpi, index }: { kpi: KPIItem; index: number }) {
  const isPositive = kpi.delta >= 0;

  return (
    <div
      className="group relative bg-[var(--surface)] rounded-md p-4 border border-[var(--border)]
        transition-all duration-200 hover:border-[rgba(82,183,136,0.3)]
        hover:shadow-[0_0_0_1px_rgba(82,183,136,0.25),0_8px_32px_rgba(64,145,108,0.18)]
        hover:-translate-y-px cursor-default"
      title={kpi.title}
    >
      <div className="text-[11px] text-[var(--text-faint)] font-medium uppercase tracking-wider mb-3">
        {kpi.title}
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-[var(--text)] leading-none">
              {"value" in kpi ? kpi.value : ""}
            </span>
            {"unit" in kpi && kpi.unit && (
              <span className="text-xs text-[var(--text-faint)]">{kpi.unit}</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            {kpi.type !== "traffic" &&
              (isPositive ? (
                <TrendingUp className="w-3 h-3 text-[var(--primary-bright)]" />
              ) : (
                <TrendingDown className="w-3 h-3 text-[var(--danger)]" />
              ))}
            <span
              className={cn(
                "text-[10px] font-medium leading-none",
                kpi.type === "traffic"
                  ? "text-[var(--text-faint)]"
                  : isPositive
                    ? "text-[var(--primary-bright)]"
                    : "text-[var(--danger)]"
              )}
            >
              {kpi.deltaLabel}
            </span>
          </div>
        </div>

        <div className="shrink-0">
          {kpi.type === "sparkline" && kpi.sparkline.length > 0 && (
            <div className="w-[72px] h-[36px]">
              <Sparkline data={kpi.sparkline} id={`kpi-${index}`} />
            </div>
          )}
          {kpi.type === "gauge" && <GaugeArc value={kpi.gaugeValue} />}
          {kpi.type === "traffic" && (
            <div className="flex flex-col items-end gap-1.5">
              <TrafficLight status={kpi.trafficLight} />
              {"subtitle" in kpi && (
                <span className="text-[9px] text-[var(--text-faint)]">{kpi.subtitle}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function KPITiles() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpiData.map((kpi, i) => (
        <KPICard key={i} kpi={kpi} index={i} />
      ))}
    </div>
  );
}
