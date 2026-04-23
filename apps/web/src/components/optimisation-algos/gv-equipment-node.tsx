"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { PlantFlowNodeData } from "@/data/g-valley-plant-flow";
import {
  GlyphAbsorptionChiller,
  GlyphAhuStrip,
  GlyphBranchNode,
  GlyphCoolingTower,
  GlyphControlCabinet,
  GlyphDhwSkid,
  GlyphFloorPanel,
  GlyphGeothermal,
  GlyphHeaderManifold,
  GlyphPressureTap,
  GlyphPump,
  GlyphValveSmall,
} from "@/components/optimisation-algos/schematic/hvac-symbols";

function Handles() {
  const cls =
    "!h-2 !w-2 !border-0 !bg-[#6cb2ff] opacity-70 hover:opacity-100";
  return (
    <>
      <Handle type="target" position={Position.Left} className={cls} />
      <Handle type="source" position={Position.Right} className={cls} />
      <Handle type="target" position={Position.Top} className={cls} />
      <Handle type="source" position={Position.Bottom} className={cls} />
    </>
  );
}

export function GvEquipmentNode({ data }: NodeProps<PlantFlowNodeData>) {
  const focused = data.highlighted;
  const compactCabinet = data.kind === "towerControl";
  const glyph = (() => {
    switch (data.kind) {
      case "tower":
        return <GlyphCoolingTower focused={focused} />;
      case "towerControl":
        return <GlyphControlCabinet focused={focused} />;
      case "chp":
        return (
          <GlyphAbsorptionChiller
            focused={focused}
            mode={data.season === "winter" ? "heat" : "cool"}
          />
        );
      case "geo":
        return <GlyphGeothermal focused={focused} />;
      case "header":
        return <GlyphHeaderManifold focused={focused} />;
      case "pumpBank":
        return <GlyphPump focused={focused} />;
      case "dhw":
        return <GlyphDhwSkid focused={focused} />;
      case "ahuFleet":
        return <GlyphAhuStrip focused={focused} />;
      case "floorPanel":
        return <GlyphFloorPanel focused={focused} />;
      case "branch":
        return <GlyphBranchNode focused={focused} />;
      default:
        return null;
    }
  })();

  return (
    <div
      className={cn(
        "relative rounded-lg border transition-all duration-200",
        compactCabinet ? "w-[128px] px-2 py-1.5" : "w-[152px] px-2.5 py-2",
        focused
          ? "border-[rgba(101,212,161,0.55)] bg-[rgba(101,212,161,0.1)] shadow-[0_0_24px_rgba(101,212,161,0.18)]"
          : "border-white/[0.12] bg-[rgba(10,14,12,0.92)] hover:border-[rgba(101,212,161,0.28)]"
      )}
    >
      <Handles />
      <svg
        viewBox="0 0 96 72"
        className={cn(
          "mx-auto block w-full max-w-[96px]",
          compactCabinet ? "h-[60px]" : "h-[72px]"
        )}
      >
        {glyph}
      </svg>
      <div
        className={cn(
          "mt-0.5 font-mono font-semibold tracking-wide text-[var(--primary-bright)]",
          compactCabinet ? "text-[9px]" : "text-[10px]"
        )}
      >
        {data.tagKo}
      </div>
      <div className={cn("leading-snug text-foreground-faint", compactCabinet ? "text-[7.5px]" : "text-[8px]")}>
        {data.tagEn}
      </div>
      <div
        className={cn(
          "mt-0.5 leading-snug text-foreground-muted line-clamp-2",
          compactCabinet ? "text-[8px]" : "text-[9px]"
        )}
      >
        {data.roleKo}
      </div>
      <div
        className={cn("leading-snug text-foreground-faint line-clamp-2", compactCabinet ? "text-[7px]" : "text-[8px]")}
      >
        {data.roleEn}
      </div>
      <div className="mt-1.5 flex items-center gap-1 text-foreground-faint">
        <GlyphPressureTap />
        <GlyphValveSmall />
      </div>
    </div>
  );
}
