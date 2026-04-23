"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Shared P&ID-style equipment glyphs — viewBox 0 0 96 72 unless noted */

const stroke = "rgba(255,255,255,0.22)";
const strokeHi = "rgba(101,212,161,0.75)";

type FocusProps = { focused?: boolean };

export function GlyphCoolingTower({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_12px_rgba(108,178,255,0.45)]")}>
      <path
        d="M 20 52 L 28 20 L 68 20 L 76 52 Z"
        fill="rgba(108,178,255,0.12)"
        stroke={focused ? "#6cb2ff" : stroke}
        strokeWidth={focused ? 2 : 1.5}
      />
      <path d="M 32 28 L 40 44 M 48 26 L 48 46 M 56 28 L 64 44" stroke="rgba(108,178,255,0.35)" strokeWidth="1.2" />
      <rect x="42" y="8" width="12" height="14" rx="2" fill="rgba(17,27,22,0.9)" stroke={stroke} strokeWidth="1" />
    </g>
  );
}

export function GlyphAbsorptionChiller({ focused, mode }: FocusProps & { mode: "cool" | "heat" }) {
  const accent = mode === "cool" ? "#6cb2ff" : "#e57373";
  return (
    <g className={cn(focused && "drop-shadow-[0_0_12px_rgba(101,212,161,0.4)]")}>
      <rect
        x="12"
        y="18"
        width="72"
        height="44"
        rx="10"
        fill="rgba(27,67,50,0.35)"
        stroke={focused ? strokeHi : stroke}
        strokeWidth={focused ? 2 : 1.5}
      />
      <circle cx="34" cy="40" r="10" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.85" />
      <circle cx="62" cy="40" r="10" fill="none" stroke={accent} strokeWidth="1.5" opacity="0.85" />
      <path d="M 24 28 L 72 28" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    </g>
  );
}

export function GlyphPump({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_10px_rgba(101,212,161,0.35)]")}>
      <circle
        cx="48"
        cy="36"
        r="22"
        fill="rgba(17,27,22,0.95)"
        stroke={focused ? strokeHi : stroke}
        strokeWidth={focused ? 2 : 1.5}
      />
      <path d="M 48 22 L 62 42 L 34 42 Z" fill="rgba(82,183,136,0.25)" stroke={focused ? strokeHi : "rgba(82,183,136,0.5)"} />
    </g>
  );
}

export function GlyphHeaderManifold({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_12px_rgba(108,178,255,0.35)]")}>
      <rect
        x="10"
        y="22"
        width="76"
        height="32"
        rx="6"
        fill="rgba(18,22,28,0.95)"
        stroke={focused ? "#6cb2ff" : stroke}
        strokeWidth={focused ? 2 : 1.5}
      />
      <path d="M 18 22 L 18 12 M 38 22 L 38 8 M 58 22 L 58 8 M 78 22 L 78 12" stroke="rgba(108,178,255,0.45)" strokeWidth="2" />
      <path d="M 18 54 L 18 64 M 38 54 L 38 68 M 58 54 L 58 68 M 78 54 L 78 64" stroke="rgba(229,115,115,0.45)" strokeWidth="2" />
    </g>
  );
}

export function GlyphGeothermal({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_12px_rgba(108,178,255,0.4)]")}>
      <path
        d="M 48 8 C 28 28 28 44 48 64 C 68 44 68 28 48 8"
        fill="rgba(16,26,36,0.9)"
        stroke={focused ? "#6cb2ff" : stroke}
        strokeWidth={focused ? 2 : 1.5}
      />
      <path d="M 48 18 L 48 54 M 32 36 L 64 36" stroke="rgba(108,178,255,0.25)" strokeWidth="1.2" />
    </g>
  );
}

export function GlyphDhwSkid({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_12px_rgba(246,195,68,0.35)]")}>
      <rect
        x="14"
        y="28"
        width="36"
        height="36"
        rx="6"
        fill="rgba(246,195,68,0.08)"
        stroke={focused ? "#f6c344" : stroke}
        strokeWidth={focused ? 2 : 1.5}
      />
      <rect
        x="54"
        y="20"
        width="28"
        height="48"
        rx="14"
        fill="rgba(30,28,22,0.95)"
        stroke={focused ? "#f6c344" : "rgba(246,195,68,0.35)"}
        strokeWidth={1.5}
      />
    </g>
  );
}

export function GlyphAhuStrip({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_10px_rgba(82,183,136,0.35)]")}>
      <rect
        x="8"
        y="20"
        width="80"
        height="36"
        rx="6"
        fill="rgba(21,26,24,0.95)"
        stroke={focused ? strokeHi : "rgba(64,145,108,0.45)"}
        strokeWidth={focused ? 2 : 1.5}
      />
      {[22, 34, 46, 58, 70].map((x) => (
        <line key={x} x1={x} y1="26" x2={x} y2="50" stroke="rgba(82,183,136,0.2)" strokeWidth="2" />
      ))}
    </g>
  );
}

/** Media / panel filter bank — viewBox 0 0 96 72 */
export function GlyphMediaFilter({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_8px_rgba(101,212,161,0.25)]")}>
      <rect
        x="18"
        y="16"
        width="60"
        height="40"
        rx="5"
        fill="rgba(17,27,22,0.96)"
        stroke={focused ? strokeHi : stroke}
        strokeWidth={1.4}
      />
      {[24, 36, 48, 60, 72].map((x) => (
        <line key={x} x1={x} y1="20" x2={x} y2="52" stroke="rgba(101,212,161,0.22)" strokeWidth="1.8" />
      ))}
      <text x="48" y="66" textAnchor="middle" className="fill-foreground-muted font-mono text-[8px]">
        FILT
      </text>
    </g>
  );
}

/** Electric preheat strip — E/H on BAS AHU-19 (viewBox 0 0 56 48) */
export function GlyphElectricPreheat({ active }: { active?: boolean }) {
  return (
    <g>
      <rect
        x="6"
        y="10"
        width="44"
        height="30"
        rx="4"
        fill={active ? "rgba(229,115,115,0.18)" : "rgba(30,22,22,0.9)"}
        stroke={active ? "rgba(229,115,115,0.65)" : stroke}
        strokeWidth={1.2}
      />
      <path
        d="M 12 18 L 18 32 M 22 16 L 28 34 M 32 18 L 38 32 M 42 16 L 48 30"
        stroke="rgba(229,115,115,0.55)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <text x="28" y="46" textAnchor="middle" className="fill-foreground-muted font-mono text-[7px]">
        E/H
      </text>
    </g>
  );
}

/** Heating (H) or cooling (C) coil face — BAS blocks (viewBox 0 0 44 52) */
export function GlyphHxFace({ mode }: { mode: "heat" | "cool" }) {
  const accent = mode === "heat" ? "#e57373" : "#6cb2ff";
  const fill = mode === "heat" ? "rgba(229,115,115,0.12)" : "rgba(108,178,255,0.1)";
  return (
    <g>
      <rect x="4" y="6" width="36" height="36" rx="5" fill={fill} stroke={accent} strokeWidth="1.4" opacity="0.95" />
      {[14, 22, 30].map((y) => (
        <line key={y} x1="10" y1={y} x2="34" y2={y} stroke={accent} strokeOpacity="0.35" strokeWidth="1.2" />
      ))}
      <text
        x="22"
        y="48"
        textAnchor="middle"
        className="font-mono text-[9px] font-semibold"
        fill={accent}
      >
        {mode === "heat" ? "H" : "C"}
      </text>
    </g>
  );
}

/** Centrifugal supply / return fan — scroll housing + impeller (viewBox 0 0 112 58) */
export function GlyphCentrifugalFan({ rps, label }: { rps: number; label: "RF" | "SF" }) {
  const dur = 1 / Math.max(0.2, rps);
  return (
    <g>
      <path
        d="M 6 38 L 12 16 L 86 16 L 92 38 Q 92 50 82 52 L 16 52 Q 6 50 6 38 Z"
        fill="rgba(48,52,56,0.92)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      <circle cx="22" cy="34" r="8" fill="rgba(18,22,28,0.98)" stroke="rgba(108,178,255,0.45)" strokeWidth="1.2" />
      <motion.g style={{ transformOrigin: "64px 34px" }} animate={{ rotate: 360 }} transition={{ duration: dur, repeat: Infinity, ease: "linear" }}>
        <circle cx="64" cy="34" r="15" fill="rgba(28,32,36,0.95)" stroke="rgba(180,188,196,0.35)" strokeWidth="1.5" />
        {[0, 120, 240].map((deg) => (
          <line
            key={deg}
            x1="64"
            y1="34"
            x2="64"
            y2="22"
            stroke="rgba(210,216,222,0.65)"
            strokeWidth="2.2"
            strokeLinecap="round"
            transform={`rotate(${deg} 64 34)`}
          />
        ))}
      </motion.g>
      <text x="56" y="56" textAnchor="middle" className="fill-foreground-muted font-mono text-[8px]">
        {label}
      </text>
    </g>
  );
}

/** Vertical intake / mixing damper — openPct 0–100 (viewBox 0 0 40 56) */
export function GlyphDamperVertical({ openPct, label }: { openPct: number; label: string }) {
  const angle = (openPct / 100) * 75;
  return (
    <g>
      <rect x="4" y="4" width="32" height="48" rx="3" fill="rgba(17,22,20,0.95)" stroke={stroke} strokeWidth="1" />
      <motion.g style={{ transformOrigin: "20px 28px" }} animate={{ rotate: -40 + angle }}>
        <line x1="20" y1="12" x2="20" y2="44" stroke="rgba(255,255,255,0.55)" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      <text x="20" y="54" textAnchor="middle" className="fill-foreground-faint font-mono text-[6px]">
        {label}
      </text>
    </g>
  );
}

/** CHW valve / actuator readout (viewBox 0 0 72 36) */
export function GlyphChwValveTag({ pct }: { pct: number }) {
  return (
    <g>
      <rect x="2" y="2" width="68" height="30" rx="4" fill="rgba(12,16,20,0.92)" stroke="rgba(108,178,255,0.35)" strokeWidth="1" />
      <text x="36" y="14" textAnchor="middle" className="fill-foreground-faint font-mono text-[6px]">
        CHR · CHS
      </text>
      <text x="36" y="26" textAnchor="middle" className="fill-[var(--primary-bright)] font-mono text-[9px] font-semibold tabular-nums">
        {pct.toFixed(1)}%
      </text>
    </g>
  );
}

export function GlyphCoil({ valvePct, focused }: FocusProps & { valvePct: number }) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_8px_rgba(82,183,136,0.3)]")}>
      <rect
        x="12"
        y="14"
        width="72"
        height="48"
        rx="8"
        fill="rgba(27,67,50,0.45)"
        stroke={focused ? strokeHi : "rgba(82,183,136,0.45)"}
        strokeWidth={1.5}
      />
      <path d="M 22 22 L 74 22 M 22 32 L 74 32 M 22 42 L 74 42 M 22 52 L 74 52" stroke="rgba(108,178,255,0.2)" strokeWidth="1.2" />
      <text x="48" y="40" textAnchor="middle" className="fill-[var(--primary-bright)] text-[9px] font-mono">
        {Math.round(valvePct)}%
      </text>
    </g>
  );
}

export function GlyphDamper({ oaPct }: { oaPct: number }) {
  const angle = (oaPct / 100) * 70;
  return (
    <g>
      <rect x="20" y="20" width="56" height="32" rx="4" fill="rgba(17,27,22,0.9)" stroke={stroke} strokeWidth="1.2" />
      <g transform={`rotate(${-35 + angle} 48 36)`}>
        <line x1="48" y1="24" x2="48" y2="48" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
      </g>
    </g>
  );
}

export function GlyphControlCabinet({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_10px_rgba(101,212,161,0.35)]")}>
      <rect
        x="14"
        y="14"
        width="68"
        height="46"
        rx="6"
        fill="rgba(20,28,26,0.95)"
        stroke={focused ? strokeHi : stroke}
        strokeWidth={focused ? 2 : 1.4}
      />
      <rect x="22" y="22" width="18" height="14" rx="2" fill="rgba(82,183,136,0.22)" />
      <rect x="44" y="22" width="30" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
      <rect x="44" y="30" width="24" height="4" rx="2" fill="rgba(255,255,255,0.12)" />
      <circle cx="28" cy="46" r="4" fill="rgba(108,178,255,0.65)" />
      <circle cx="40" cy="46" r="4" fill="rgba(229,115,115,0.65)" />
    </g>
  );
}

export function GlyphBranchNode({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_10px_rgba(101,212,161,0.35)]")}>
      <rect
        x="16"
        y="18"
        width="64"
        height="38"
        rx="7"
        fill="rgba(17,24,22,0.95)"
        stroke={focused ? strokeHi : stroke}
        strokeWidth={focused ? 2 : 1.4}
      />
      <path d="M 26 37 L 70 37 M 48 24 L 48 50" stroke="rgba(101,212,161,0.38)" strokeWidth="2" />
      <circle cx="48" cy="37" r="4" fill="rgba(101,212,161,0.65)" />
    </g>
  );
}

export function GlyphFloorPanel({ focused }: FocusProps) {
  return (
    <g className={cn(focused && "drop-shadow-[0_0_10px_rgba(108,178,255,0.35)]")}>
      <rect
        x="8"
        y="12"
        width="80"
        height="50"
        rx="6"
        fill="rgba(14,22,28,0.95)"
        stroke={focused ? "#6cb2ff" : stroke}
        strokeWidth={focused ? 2 : 1.4}
      />
      {[22, 31, 40, 49].map((y) => (
        <line key={y} x1="18" y1={y} x2="76" y2={y} stroke="rgba(108,178,255,0.28)" strokeWidth="1.6" />
      ))}
    </g>
  );
}

export function GlyphPressureTap() {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5">
      <circle cx="7" cy="7" r="6" fill="rgba(10,18,16,0.9)" stroke="rgba(108,178,255,0.6)" />
      <path d="M 7 7 L 10 5" stroke="rgba(108,178,255,0.85)" strokeWidth="1.2" />
    </svg>
  );
}

export function GlyphValveSmall() {
  return (
    <svg viewBox="0 0 14 14" className="h-3.5 w-3.5">
      <path d="M 2 7 L 12 7 M 5 3 L 9 11 M 9 3 L 5 11" stroke="rgba(101,212,161,0.8)" strokeWidth="1.2" />
    </svg>
  );
}
