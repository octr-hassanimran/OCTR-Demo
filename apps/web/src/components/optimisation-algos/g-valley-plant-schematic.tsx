"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { floorModel, plantLabels, plantNodes, type PlantNodeId } from "@/data/g-valley-optimisation-strategies";
import { SchematicCanvasShell, SchematicLegend } from "@/components/optimisation-algos/schematic/schematic-chrome";
import { floorServiceGroups, hvacScreenNodes, valueCallouts, type ScreenNodeId } from "@/data/g-valley-hvac-screen";
import { getIncidentEdgeIds } from "@/data/g-valley-plant-flow";

const GValleyPlantHero3d = dynamic(
  () =>
    import("@/components/optimisation-algos/g-valley-plant-hero-3d").then((m) => m.GValleyPlantHero3d),
  {
    ssr: false,
    loading: () => (
      <div className="relative h-[220px] w-full overflow-hidden rounded-t-lg border-b border-white/[0.08] bg-[#05080a] md:h-[260px]">
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,rgba(101,212,161,0.06)_0%,rgba(8,12,10,0.4)_40%,rgba(101,212,161,0.06)_80%)] bg-[length:200%_100%]" />
        <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
          Loading 3D overview…
        </div>
      </div>
    ),
  }
);

const GValleyPlantFlowCanvas = dynamic(
  () =>
    import("@/components/optimisation-algos/g-valley-plant-flow-canvas").then((m) => m.GValleyPlantFlowCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="g-valley-flow flex h-[min(560px,70vh)] min-h-[420px] w-full items-center justify-center rounded-b-lg border-t border-white/[0.06] bg-black/20">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-foreground-faint">
          Loading topology…
        </span>
      </div>
    ),
  }
);

const nodeById = Object.fromEntries(plantNodes.map((n) => [n.id, n])) as Record<
  PlantNodeId,
  (typeof plantNodes)[number]
>;
const screenNodeById = Object.fromEntries(
  hvacScreenNodes.map((n) => [n.id, n])
) as Record<ScreenNodeId, (typeof hvacScreenNodes)[number]>;

type Season = "summer" | "winter";

export function GValleyPlantSchematic() {
  const [focus, setFocus] = useState<ScreenNodeId | null>(null);
  const [season, setSeason] = useState<Season>("summer");
  const [activeFloorRow, setActiveFloorRow] = useState<string | null>(null);
  const [activeCallout, setActiveCallout] = useState<string | null>(null);

  const focusedNode = focus ? screenNodeById[focus] : null;
  const baseNodeMeta = focusedNode?.basePlantId ? nodeById[focusedNode.basePlantId] : null;

  const highlightedEdgeIds = useMemo(() => {
    const merged = new Set<string>();
    if (focus) {
      getIncidentEdgeIds(focus).forEach((id) => merged.add(id));
    }
    if (activeFloorRow) {
      const row = floorServiceGroups.find((f) => f.id === activeFloorRow);
      row?.targetEdges.forEach((id) => merged.add(id));
    }
    if (activeCallout) {
      const callout = valueCallouts.find((v) => v.id === activeCallout);
      if (callout) {
        getIncidentEdgeIds(callout.relatedNode).forEach((id) => merged.add(id));
      }
    }
    return merged.size ? merged : undefined;
  }, [focus, activeFloorRow, activeCallout]);

  const seasonNote = useMemo(
    () =>
      season === "summer"
        ? "Cooling: CHP rejects heat to tower branches; CHW headers feed mid/high floors and AHUs."
        : "Heating: CHP supplies heating water; geothermal augments low floors (1F–5F).",
    [season]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-[10px] text-foreground-faint uppercase tracking-[0.16em]">
          Season
        </span>
        <div className="inline-flex rounded-md border border-white/[0.1] p-0.5 bg-black/25">
          {(["summer", "winter"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSeason(s)}
              className={cn(
                "px-3 py-1.5 font-mono text-[10px] rounded-md transition-all uppercase tracking-wide",
                season === s
                  ? "bg-[rgba(82,183,136,0.2)] text-[var(--primary-bright)] border border-[rgba(82,183,136,0.35)]"
                  : "text-foreground-muted hover:text-foreground"
              )}
            >
              {s === "summer" ? "Cooling" : "Heating"}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-foreground-muted max-w-xl leading-relaxed">{seasonNote}</p>
      </div>

      <SchematicCanvasShell>
        <SchematicLegend />
        <GValleyPlantHero3d
          season={season}
          focus={focusedNode?.basePlantId ?? null}
        />
        <div className="grid gap-0 border-b border-white/[0.06] bg-black/15 md:grid-cols-[minmax(0,1fr)_200px]">
          <div className="p-4 text-[11px] leading-relaxed text-foreground-muted md:border-r md:border-white/[0.06]">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--primary-bright)]">
              Topology map
            </p>
            <p className="mt-2">
              Pan and zoom the P&amp;ID graph. Node positions are driven by{" "}
              <span className="font-mono text-foreground/90">g-valley-plant-flow.ts</span> for quick edits.
            </p>
            <ul className="mt-2 space-y-1 font-mono text-[10px] text-foreground-faint">
              <li>
                {plantLabels.coolingTowers.join(" · ")} · {plantLabels.chp.join(" · ")}
              </li>
              <li>
                {floorModel.officeFloors} floors + {floorModel.basementFloors.length} basement · geo{" "}
                {floorModel.geothermalHeatingFloors}
              </li>
            </ul>
          </div>
          <div className="hidden p-4 md:block">
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-foreground-faint">
              Live focus
            </div>
            <div className="mt-2 min-h-[4rem] font-mono text-[11px] text-[var(--primary-bright)] leading-snug">
              {focusedNode ? focusedNode.tagKo : "—"}
            </div>
            <div className="text-[9px] text-foreground-faint font-mono">
              {focusedNode ? focusedNode.tagEn : ""}
            </div>
          </div>
        </div>
        <div className="relative">
          <GValleyPlantFlowCanvas
            season={season}
            focus={focus}
            highlightedEdgeIds={highlightedEdgeIds}
            onFocus={setFocus}
            valueCallouts={valueCallouts}
            activeCalloutId={activeCallout}
            onCalloutEnter={setActiveCallout}
            onCalloutLeave={(id) =>
              setActiveCallout((prev) => (prev === id ? null : prev))
            }
          />

          <div className="pointer-events-none absolute left-1/2 top-2 z-20 w-[min(520px,92%)] max-h-[min(200px,28vh)] -translate-x-1/2 overflow-y-auto">
            <div className="pointer-events-auto rounded-md border border-white/[0.12] bg-[rgba(10,14,12,0.92)] p-2 shadow-[0_14px_40px_rgba(0,0,0,0.35)] backdrop-blur-sm">
              <div className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--primary-bright)]">
                업무시설 서비스층 / Served floor groups
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {floorServiceGroups.map((row) => {
                  const isActive = activeFloorRow === row.id;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onMouseEnter={() => setActiveFloorRow(row.id)}
                      onMouseLeave={() => setActiveFloorRow((v) => (v === row.id ? null : v))}
                      onClick={() => setActiveFloorRow((v) => (v === row.id ? null : row.id))}
                      className={cn(
                        "rounded-md border px-2 py-1 text-left transition-all",
                        isActive
                          ? "border-[rgba(101,212,161,0.45)] bg-[rgba(101,212,161,0.08)]"
                          : "border-white/[0.08] bg-black/20 hover:border-[rgba(101,212,161,0.28)]"
                      )}
                    >
                      <div className="text-[9.5px] font-semibold leading-snug text-foreground line-clamp-2">
                        {row.labelKo}
                      </div>
                      <div className="text-[8px] leading-snug text-foreground-faint line-clamp-2">
                        {row.labelEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </SchematicCanvasShell>

      <div className="rounded-lg border border-white/[0.1] bg-[rgba(12,16,14,0.85)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm min-h-[100px]">
        {focusedNode ? (
          <div className="space-y-2">
            <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-[var(--primary-bright)]">
              {focusedNode.tagKo} / {focusedNode.tagEn}
            </div>
            <p className="text-[12px] text-foreground-muted leading-relaxed">
              {focusedNode.roleKo} · {focusedNode.roleEn}
            </p>
            {baseNodeMeta ? (
              <div className="flex flex-wrap gap-1.5">
                {baseNodeMeta.strategyRefs.map((n) => (
                  <span
                    key={n}
                    className="font-mono text-[10px] px-2 py-0.5 rounded border border-[rgba(101,212,161,0.3)] bg-[rgba(101,212,161,0.08)] text-[var(--primary-bright)]"
                  >
                    #{n}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="text-[12px] text-foreground-muted">
            Select equipment on the diagram to map optimisation strategies to plant boundaries.
          </p>
        )}
      </div>
    </div>
  );
}
