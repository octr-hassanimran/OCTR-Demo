"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  catalogInScope,
  excludedForGValley,
  floorModel,
  heroStrategies,
  strategies,
} from "@/data/g-valley-optimisation-strategies";
import { SectionCard } from "@/components/optimisation-algos/section-card";
import { GValleyPlantSchematic } from "@/components/optimisation-algos/g-valley-plant-schematic";
import { GValleyAhuSchematic } from "@/components/optimisation-algos/g-valley-ahu-schematic";
import { OssTimelineDemo } from "@/components/optimisation-algos/demos/oss-timeline-demo";
import { DeadBandDemo } from "@/components/optimisation-algos/demos/dead-band-demo";
import { MasterSatDemo } from "@/components/optimisation-algos/demos/master-sat-demo";
import { ChillerStagingDemo } from "@/components/optimisation-algos/demos/chiller-staging-demo";
import { DsprDemo } from "@/components/optimisation-algos/demos/dspr-demo";

const heroBodies: Record<number, string> = {
  1: "Latest feasible AHU and plant start based on inertia, weather, and occupancy — fewer idle kWh before people arrive.",
  2: "Keep heating and cooling from fighting the same zone; widen proportional and dead bands where controls allow.",
  3: "Blend VAV cooling requests instead of always tracking the worst zone (high select).",
  4: "Hold CHP-1-2 offline until block load and electrical draw prove the second absorption machine is warranted.",
  5: "Reset duct static pressure so the most-open VAV rides near 90–95% instead of every box being over-pressured.",
};

const demoByNumber: Record<number, ReactNode> = {
  1: <OssTimelineDemo />,
  2: <DeadBandDemo />,
  3: <MasterSatDemo />,
  4: <ChillerStagingDemo />,
  5: <DsprDemo />,
};

export function OptimisationAlgosView() {
  const inScopeCount = strategies.filter((s) => s.inScopeGValley).length;

  return (
    <div className="px-8 pb-16 pt-6 space-y-10 max-w-[1700px] mx-auto">
      <header className="space-y-2">
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-xl font-semibold text-[var(--text)]">G Valley · Optimisation Algos</h1>
          <span className="text-[11px] font-medium text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-2 py-0.5 rounded-full border border-[rgba(82,183,136,0.25)]">
            Demo narrative
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-muted)] max-w-3xl leading-relaxed">
          Interactive explanations for{" "}
          <span className="text-[var(--text)] font-medium">{inScopeCount}</span> strategies that apply to Guro G Valley
          in this engagement. Plant and AHU schematics are stylised from your BMS topology — not live SCADA.
        </p>
        <p className="text-[12px] text-[var(--text-faint)]">
          {floorModel.officeFloors} occupied floors + {floorModel.basementFloors.length} basement levels ·{" "}
          {floorModel.ahuCount} AHUs · geothermal heating {floorModel.geothermalHeatingFloors}
        </p>
      </header>

      <SectionCard
        title="Water-side plant schematic"
        description="Two absorption CHP machines (seasonal chiller or boiler), two cooling-tower groups, geothermal for low floors, headers and secondary pumps, and a separate DHW loop."
        badge="Topology"
      >
        <GValleyPlantSchematic />
      </SectionCard>

      <SectionCard
        title="Representative AHU (airside)"
        description="AHU-19 style topology: upper return deck with return fan and EA tee, vertical mixing damper, lower outdoor-air deck with E/H, filters, separate H and C faces, CHR valve, supply fan, and SA — matching the legacy BAS airside layout."
        badge={`${floorModel.ahuCount} AHUs on site`}
      >
        <GValleyAhuSchematic />
      </SectionCard>

      <div className="space-y-6">
        <h2 className="text-[11px] font-semibold text-foreground-faint uppercase tracking-widest">
          Five demonstration strips
        </h2>
        {heroStrategies.map((s) => (
          <SectionCard
            key={s.guideNumber}
            title={`#${s.guideNumber} — ${s.title}`}
            description={heroBodies[s.guideNumber] ?? s.shortLine}
            badge="Interactive"
          >
            <p className="text-[12px] text-foreground-muted mb-4 leading-relaxed">{s.shortLine}</p>
            {demoByNumber[s.guideNumber]}
          </SectionCard>
        ))}
      </div>

      <SectionCard
        title="Out of scope for this G Valley storyline"
        description="These items are excluded from this demo dashboard by project boundary — not a comment on their value elsewhere."
        badge="Transparency"
      >
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-foreground-muted">
          {excludedForGValley.map((s) => (
            <li
              key={s.guideNumber}
              className="rounded-md border border-white/[0.06] bg-black/15 px-3 py-2 flex gap-2"
            >
              <span className="text-foreground-faint tabular-nums">#{s.guideNumber}</span>
              <span>{s.title}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard
        title="Also in scope (catalog)"
        description="Concise list of additional optimisations for G Valley without duplicate heavy visuals here."
        badge="Reference"
      >
        <ul className="divide-y divide-white/[0.06] border border-white/[0.06] rounded-md overflow-hidden">
          {catalogInScope.map((s) => (
            <li key={s.guideNumber} className="px-3 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 bg-black/10">
              <div>
                <span className="text-[10px] text-foreground-faint mr-2">#{s.guideNumber}</span>
                <span className="text-[13px] text-foreground font-medium">{s.title}</span>
              </div>
              <p className="text-[11px] text-foreground-muted sm:max-w-[55%] sm:text-right">{s.shortLine}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Link
            href="/optimization/scorecard"
            className="text-[12px] text-[var(--primary-bright)] hover:underline font-medium"
          >
            Open DB-5 Strategy Scorecard for full 20-strategy analytics
          </Link>
        </div>
      </SectionCard>
    </div>
  );
}
