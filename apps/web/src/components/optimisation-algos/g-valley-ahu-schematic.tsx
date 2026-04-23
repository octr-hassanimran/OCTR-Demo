"use client";

import { useId, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SchematicCanvasShell, SchematicLegend } from "@/components/optimisation-algos/schematic/schematic-chrome";
import {
  GlyphCentrifugalFan,
  GlyphChwValveTag,
  GlyphDamperVertical,
  GlyphElectricPreheat,
  GlyphHxFace,
  GlyphMediaFilter,
} from "@/components/optimisation-algos/schematic/hvac-symbols";

/**
 * AHU-19 class topology (BMS reference): upper return deck (RA ← zones, RF, EA →),
 * vertical mixing shaft, lower outdoor/supply deck (OA →, E/H, filters, H/C, CHW valve, SF, SA →).
 */

export function GValleyAhuSchematic() {
  const rawId = useId().replace(/:/g, "");
  const [oaPct, setOaPct] = useState(15);
  const [setpointC, setSetpointC] = useState(23);
  const [spaceC, setSpaceC] = useState(23.4);
  const [coilValve, setCoilValve] = useState(72);

  const raPct = 100 - oaPct;
  const fanRpsSf = useMemo(() => 0.38 + (coilValve / 100) * 0.52 + (oaPct / 100) * 0.14, [coilValve, oaPct]);
  const fanRpsRf = fanRpsSf * 0.94;

  const deadband = useMemo(() => Math.abs(spaceC - setpointC), [spaceC, setpointC]);
  const inBand = deadband <= 0.6;

  const rhApprox = useMemo(
    () => Math.round(Math.min(78, Math.max(32, 52 + (23.5 - spaceC) * 5.5))),
    [spaceC]
  );

  const { mixApproxC, satEstC, preCoilC } = useMemo(() => {
    const oaAssumedC = 12.5;
    const mix = (oaPct / 100) * oaAssumedC + (raPct / 100) * spaceC;
    const cooling = Math.max(0, mix - setpointC);
    const sat = mix - (coilValve / 100) * Math.min(cooling * 1.2, 11);
    const pre = mix + 0.35;
    return { mixApproxC: mix, satEstC: sat, preCoilC: pre };
  }, [coilValve, oaPct, raPct, setpointC, spaceC]);

  /** Mixing damper: return-to-plenum path (higher recirc → more return available to mix). */
  const mixDamperPct = Math.round(Math.min(100, 36 + raPct * 0.64));

  const presets = [
    { label: "Recirc", oa: 0 },
    { label: "Economy mix", oa: 35 },
    { label: "High OA", oa: 55 },
  ] as const;

  const mRa = `url(#${rawId}-arr-purple)`;
  const mSa = `url(#${rawId}-arr-purple2)`;
  const mOa = `url(#${rawId}-arr-cyan)`;
  const mEa = `url(#${rawId}-arr-ea)`;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
      <SchematicCanvasShell className="overflow-hidden">
        <SchematicLegend />
        <div className="p-3 md:p-4">
          <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/[0.06] pb-2">
            <div>
              <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
                AHU-19 · return / mixing / supply
              </h3>
              <p className="mt-0.5 text-[10px] text-foreground-faint">
                Upper: RA ← RF → EA tee. Vertical: mixing damper. Lower: OA intake, E/H, filter, H &amp; C, CHR valve, SF,
                SA — aligned to legacy BAS schematic flow
              </p>
            </div>
            <span className="font-mono text-[10px] text-[var(--primary-bright)]">MODE: AUTO / CLG</span>
          </div>

          <figure className="mx-auto w-full max-w-[920px]" aria-label="AHU-19 style airside schematic">
            <div className="aspect-[920/438] w-full min-h-[220px]">
              <svg
                viewBox="0 0 920 438"
                className="h-full w-full drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                role="img"
                aria-labelledby={`${rawId}-ahu-title`}
              >
                <title id={`${rawId}-ahu-title`}>AHU-19 return fan, mixing section, and supply deck</title>
                <desc>
                  Return air enters the upper duct from the right, passes the return fan, and can exhaust on the left or
                  drop through a mixing damper to join outdoor air on the lower supply deck. Outdoor air enters from the
                  left through intake dampers, preheat, filters, heating and cooling coils with chilled-water valve,
                  supply fan, and discharges as supply air to the right.
                </desc>

                <defs>
                  <linearGradient id={`${rawId}-ductTop`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                    <stop offset="35%" stopColor="rgba(229,115,115,0.14)" />
                    <stop offset="100%" stopColor="rgba(28,16,18,0.92)" />
                  </linearGradient>
                  <linearGradient id={`${rawId}-ductBot`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
                    <stop offset="40%" stopColor="rgba(108,178,255,0.12)" />
                    <stop offset="100%" stopColor="rgba(12,18,32,0.92)" />
                  </linearGradient>
                  <linearGradient id={`${rawId}-ductVert`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgba(101,212,161,0.08)" />
                    <stop offset="50%" stopColor="rgba(20,26,24,0.92)" />
                    <stop offset="100%" stopColor="rgba(101,212,161,0.06)" />
                  </linearGradient>
                  <filter id={`${rawId}-softGlow`} x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="b" />
                    <feMerge>
                      <feMergeNode in="b" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <marker id={`${rawId}-arr-purple`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L0,8 L8,4 z" fill="rgba(167,139,250,0.9)" />
                  </marker>
                  <marker id={`${rawId}-arr-purple2`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L0,8 L8,4 z" fill="rgba(167,139,250,0.92)" />
                  </marker>
                  <marker id={`${rawId}-arr-cyan`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L0,8 L8,4 z" fill="rgba(94,234,212,0.9)" />
                  </marker>
                  <marker id={`${rawId}-arr-ea`} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                    <path d="M0,0 L0,8 L8,4 z" fill="rgba(125,211,252,0.85)" />
                  </marker>
                </defs>

                {/* Lower supply deck (draw first — mixing shaft stacks on the joint) */}
                <rect
                  x="72"
                  y="264"
                  width="776"
                  height="54"
                  rx="12"
                  fill={`url(#${rawId}-ductBot)`}
                  stroke="rgba(108,178,255,0.4)"
                  strokeWidth="1.5"
                  filter={`url(#${rawId}-softGlow)`}
                />

                {/* Upper return / exhaust deck */}
                <rect
                  x="116"
                  y="50"
                  width="700"
                  height="46"
                  rx="11"
                  fill={`url(#${rawId}-ductTop)`}
                  stroke="rgba(229,115,115,0.4)"
                  strokeWidth="1.5"
                  filter={`url(#${rawId}-softGlow)`}
                />

                {/* Mixing shaft — ties upper RA path to lower mixed-air plenum */}
                <rect
                  x="210"
                  y="96"
                  width="52"
                  height="168"
                  rx="9"
                  fill={`url(#${rawId}-ductVert)`}
                  stroke="rgba(101,212,161,0.45)"
                  strokeWidth="1.5"
                />
                <text x="236" y="184" textAnchor="middle" className="fill-foreground-faint font-mono text-[7px]" opacity="0.88">
                  MIX
                </text>

                {/* EA branch — exhaust tee off return deck (BAS left exit) */}
                <path
                  d="M 152 73 L 52 73 L 52 36"
                  fill="none"
                  stroke="rgba(125,211,252,0.35)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="4 5"
                />
                <text x="56" y="32" className="fill-foreground-muted font-mono text-[8px]">
                  EA
                </text>
                <rect x="58" y="48" width="22" height="28" rx="2" fill="rgba(14,18,22,0.9)" stroke="rgba(125,211,252,0.3)" />
                <text x="69" y="64" textAnchor="middle" className="fill-foreground-faint font-mono text-[6px]">
                  damp
                </text>

                {/* RA arrow — zones on right */}
                <text x="848" y="62" textAnchor="end" className="fill-foreground-muted font-mono text-[9px] font-semibold">
                  RA
                </text>
                <polygon points="808,60 828,73 808,86" fill="rgba(167,139,250,0.35)" stroke="rgba(167,139,250,0.7)" strokeWidth="1" />

                {/* OA arrow */}
                <polygon points="46,276 66,291 46,306" fill="rgba(94,234,212,0.3)" stroke="rgba(94,234,212,0.75)" strokeWidth="1" />
                <text x="40" y="296" textAnchor="end" className="fill-foreground-muted font-mono text-[9px] font-semibold">
                  OA
                </text>

                {/* SA arrow */}
                <text x="878" y="288" textAnchor="middle" className="fill-foreground-muted font-mono text-[9px] font-semibold">
                  SA
                </text>
                <polygon points="864,276 884,291 864,306" fill="rgba(167,139,250,0.35)" stroke="rgba(167,139,250,0.75)" strokeWidth="1" />

                {/* Animated flows */}
                <motion.path
                  d="M 788 73 L 236 73 L 236 264"
                  fill="none"
                  stroke="rgba(229,115,115,0.52)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="7 11"
                  markerEnd={mRa}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -90 }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M 236 264 L 360 291"
                  fill="none"
                  stroke="rgba(101,212,161,0.5)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 9"
                  markerEnd={mOa}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -75 }}
                  transition={{ duration: 2.1, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M 68 291 L 848 291"
                  fill="none"
                  stroke="rgba(94,234,212,0.48)"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeDasharray="8 12"
                  markerEnd={mSa}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -100 }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                />
                <motion.path
                  d="M 132 73 L 54 73"
                  fill="none"
                  stroke="rgba(125,211,252,0.42)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="5 7"
                  markerEnd={mEa}
                  initial={{ strokeDashoffset: 0 }}
                  animate={{ strokeDashoffset: -50 }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "linear" }}
                />

                {/* BMS-style sensor tags */}
                <g>
                  <rect x="612" y="12" width="112" height="40" rx="3" fill="#e8eaed" stroke="#1f2937" strokeWidth="0.9" />
                  <text x="620" y="24" fill="#374151" className="font-mono text-[8px]">
                    RA sensor
                  </text>
                  <text x="620" y="36" fill="#111827" className="font-mono text-[9px] font-semibold tabular-nums">
                    {spaceC.toFixed(1)} °C
                  </text>
                  <text x="620" y="48" fill="#111827" className="font-mono text-[9px] font-semibold tabular-nums">
                    {rhApprox} %RH
                  </text>
                </g>
                <g>
                  <rect x="248" y="218" width="118" height="34" rx="3" fill="#e8eaed" stroke="#1f2937" strokeWidth="0.9" />
                  <text x="256" y="230" fill="#374151" className="font-mono text-[8px]">
                    Pre-coil
                  </text>
                  <text x="256" y="244" fill="#111827" className="font-mono text-[9px] font-semibold tabular-nums">
                    {preCoilC.toFixed(1)} °C
                  </text>
                </g>
                <g>
                  <rect x="618" y="236" width="104" height="34" rx="3" fill="#e8eaed" stroke="#1f2937" strokeWidth="0.9" />
                  <text x="626" y="248" fill="#374151" className="font-mono text-[8px]">
                    SAT
                  </text>
                  <text x="626" y="262" fill="#111827" className="font-mono text-[9px] font-semibold tabular-nums">
                    {satEstC.toFixed(1)} °C
                  </text>
                </g>

                {/* Return fan — upper deck */}
                <g transform="translate(448, 46)">
                  <GlyphCentrifugalFan rps={fanRpsRf} label="RF" />
                </g>

                {/* Supply fan — lower deck */}
                <g transform="translate(412, 250)">
                  <GlyphCentrifugalFan rps={fanRpsSf} label="SF" />
                </g>

                {/* OA intake damper — vertical louver at outdoor entry */}
                <g transform="translate(90, 262)">
                  <GlyphDamperVertical openPct={oaPct} label="OA" />
                </g>
                <text x="110" y="350" textAnchor="middle" className="fill-foreground-muted font-mono text-[8px] tabular-nums">
                  {oaPct.toFixed(0)}%
                </text>

                {/* Mixing damper — return-to-supply path in vertical shaft */}
                <g transform="translate(214, 142)">
                  <GlyphDamperVertical openPct={mixDamperPct} label="MIX" />
                </g>
                <text x="236" y="210" textAnchor="middle" className="fill-foreground-faint font-mono text-[7px] tabular-nums">
                  {mixDamperPct}%
                </text>

                {/* E/H, filter, H/C faces, CHW valve tag (BAS sequence) */}
                <g transform="translate(138, 266)">
                  <GlyphElectricPreheat active={!inBand && spaceC < setpointC - 0.3} />
                </g>
                <g transform="translate(192, 270) scale(0.5)">
                  <GlyphMediaFilter focused={oaPct > 22} />
                </g>
                <g transform="translate(246, 264)">
                  <GlyphHxFace mode="heat" />
                </g>
                <g transform="translate(296, 264)">
                  <GlyphHxFace mode="cool" />
                </g>
                <g transform="translate(346, 272)">
                  <GlyphChwValveTag pct={coilValve} />
                </g>

                {/* Summary strip */}
                <rect
                  x="78"
                  y="372"
                  width="764"
                  height="40"
                  rx="8"
                  fill="rgba(6,10,14,0.88)"
                  stroke="rgba(101,212,161,0.2)"
                  strokeWidth="1"
                />
                <text x="92" y="388" className="fill-foreground-faint font-mono text-[8px]">
                  MIX (est.)
                </text>
                <text x="92" y="402" className="fill-foreground font-mono text-[10px] font-medium tabular-nums">
                  {mixApproxC.toFixed(1)} °C
                </text>
                <text x="220" y="388" className="fill-foreground-faint font-mono text-[8px]">
                  OA / RA blend
                </text>
                <text x="220" y="402" className="fill-foreground-muted font-mono text-[10px] tabular-nums">
                  {oaPct.toFixed(0)}% / {raPct.toFixed(0)}%
                </text>
                <text x="360" y="388" className="fill-foreground-faint font-mono text-[8px]">
                  CHR valve (demo)
                </text>
                <text x="360" y="402" className="fill-[var(--info)] font-mono text-[10px] font-medium tabular-nums">
                  {coilValve.toFixed(0)}%
                </text>
                <text x="520" y="388" className="fill-foreground-faint font-mono text-[8px]">
                  SAT (est.)
                </text>
                <text x="520" y="402" className="fill-foreground font-mono text-[10px] font-medium tabular-nums">
                  {satEstC.toFixed(1)} °C
                </text>
              </svg>
            </div>
          </figure>
        </div>
      </SchematicCanvasShell>

      <div className="space-y-4 text-[12px]">
        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground-faint">
            Outdoor air intake
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={oaPct}
            onChange={(e) => setOaPct(Number(e.target.value))}
            className="w-full accent-[var(--primary-bright)]"
          />
          <div className="mt-1 flex justify-between font-mono text-[11px] text-foreground-muted tabular-nums">
            <span>OA damper {oaPct.toFixed(0)}%</span>
            <span>RA {raPct.toFixed(0)}%</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setOaPct(p.oa)}
                className="rounded-md border border-white/[0.1] px-2 py-1 font-mono text-[9px] text-foreground-muted hover:border-[rgba(82,183,136,0.35)] hover:text-foreground"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground-faint">
            Zone vs setpoint
          </div>
          <label className="flex items-center justify-between gap-2 font-mono text-[11px] text-foreground-muted">
            SP °C
            <input
              type="number"
              step={0.1}
              value={setpointC}
              onChange={(e) => setSetpointC(Number(e.target.value))}
              className="w-[4.5rem] rounded border border-white/[0.12] bg-black/35 px-2 py-1 text-right text-foreground tabular-nums"
            />
          </label>
          <label className="mt-2 flex items-center justify-between gap-2 font-mono text-[11px] text-foreground-muted">
            Space °C
            <input
              type="number"
              step={0.1}
              value={spaceC}
              onChange={(e) => setSpaceC(Number(e.target.value))}
              className="w-[4.5rem] rounded border border-white/[0.12] bg-black/35 px-2 py-1 text-right text-foreground tabular-nums"
            />
          </label>
          <div
            className={cn(
              "mt-2 rounded-md border px-2 py-1.5 font-mono text-[10px]",
              inBand
                ? "border-[rgba(82,183,136,0.35)] bg-[rgba(82,183,136,0.08)] text-[var(--primary-bright)]"
                : "border-[rgba(246,195,68,0.35)] bg-[rgba(246,195,68,0.08)] text-[var(--warning)]"
            )}
          >
            Δ {deadband.toFixed(1)} °C — {inBand ? "in band" : "coil / reheat"}
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground-faint">
            CHW valve (CHR)
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={coilValve}
            onChange={(e) => setCoilValve(Number(e.target.value))}
            className="w-full accent-[var(--info)]"
          />
        </div>

        <p className="border-t border-white/[0.06] pt-3 text-[11px] leading-relaxed text-foreground-muted">
          <span className="font-mono text-[var(--primary-bright)]">#5</span> DSPR downstream ·{" "}
          <span className="font-mono text-[var(--primary-bright)]">#3</span> master SAT ·{" "}
          <span className="font-mono text-[var(--primary-bright)]">#10–11</span> OA when enthalpy / purge allows
        </p>
      </div>
    </div>
  );
}
