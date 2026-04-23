import type { Edge, Node } from "@xyflow/react";
import {
  hvacPipeSegments,
  hvacScreenNodes,
  type PipeMedium,
  type ScreenNodeId,
  type ScreenNodeKind,
} from "@/data/g-valley-hvac-screen";
import type { PlantNodeId } from "@/data/g-valley-optimisation-strategies";

/** Omitted from the React Flow graph — rendered as separate UI (e.g. floor overlay) or unused in topology. */
const OMIT_FROM_FLOW_GRAPH = new Set<ScreenNodeId>(["floorServicePanel"]);

export type PlantFlowNodeData = {
  screenNodeId: ScreenNodeId;
  basePlantId?: PlantNodeId;
  kind: ScreenNodeKind;
  tagKo: string;
  tagEn: string;
  roleKo: string;
  roleEn: string;
  orientation: "up" | "down" | "left" | "right" | "mixed";
  highlighted: boolean;
  season: "summer" | "winter";
};

const mediumColor = (medium: PipeMedium, season: "summer" | "winter"): string => {
  if (medium === "signal") return "rgba(167,196,181,0.45)";
  if (medium === "warm") return season === "winter" ? "rgba(240,165,140,0.55)" : "rgba(229,115,115,0.5)";
  if (medium === "neutral") return "rgba(95,130,145,0.55)";
  return "rgba(108,178,255,0.55)";
};

const edgeIdByNode: Record<ScreenNodeId, string[]> = hvacScreenNodes.reduce(
  (acc, node) => {
    acc[node.id] = hvacPipeSegments
      .filter((s) => s.source === node.id || s.target === node.id)
      .map((s) => s.id);
    return acc;
  },
  {} as Record<ScreenNodeId, string[]>
);

export function getIncidentEdgeIds(focus: ScreenNodeId | null): Set<string> {
  if (!focus) return new Set();
  return new Set(edgeIdByNode[focus] ?? []);
}

export function buildPlantFlowNodes(
  season: "summer" | "winter",
  focus: ScreenNodeId | null
): Node<PlantFlowNodeData>[] {
  return hvacScreenNodes
    .filter((node) => !OMIT_FROM_FLOW_GRAPH.has(node.id))
    .map((node) => ({
      id: node.id,
      type: "gvEquipment",
      position: node.pos,
      data: {
        screenNodeId: node.id,
        basePlantId: node.basePlantId,
        kind: node.kind,
        tagKo: node.tagKo,
        tagEn: node.tagEn,
        roleKo: node.roleKo,
        roleEn: node.roleEn,
        orientation: node.orientation,
        highlighted: focus === node.id,
        season,
      },
    }));
}

export function buildPlantFlowEdges(
  season: "summer" | "winter",
  focus: ScreenNodeId | null,
  highlightedEdgeIds?: Set<string>
): Edge[] {
  const hi = highlightedEdgeIds ?? getIncidentEdgeIds(focus);

  return hvacPipeSegments.map((segment) => {
    const isHi = hi.has(segment.id);
    const color = isHi ? "#65d4a1" : mediumColor(segment.medium, season);
    return {
      id: segment.id,
      source: segment.source,
      target: segment.target,
      type: segment.direction === "up" || segment.direction === "down" ? "step" : "smoothstep",
      animated: segment.branch !== "secondary",
      style: {
        stroke: color,
        strokeWidth: isHi ? 3.2 : segment.branch === "primary" ? 2.4 : 1.8,
        strokeDasharray: segment.medium === "signal" ? "4 3" : undefined,
      },
    };
  });
}
