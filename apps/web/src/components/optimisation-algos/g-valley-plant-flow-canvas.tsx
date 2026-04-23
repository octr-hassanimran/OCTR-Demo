"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import type { MouseEvent } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  ViewportPortal,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
  type NodeTypes,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { buildPlantFlowEdges, buildPlantFlowNodes } from "@/data/g-valley-plant-flow";
import {
  SCREEN_CANVAS,
  type CalloutConfidence,
  type ScreenNodeId,
  type ValueCallout,
} from "@/data/g-valley-hvac-screen";
import { GvEquipmentNode } from "@/components/optimisation-algos/gv-equipment-node";
import { cn } from "@/lib/utils";

const nodeTypes: NodeTypes = {
  gvEquipment: GvEquipmentNode,
};

type Season = "summer" | "winter";

type Props = {
  season: Season;
  focus: ScreenNodeId | null;
  highlightedEdgeIds?: Set<string>;
  onFocus: (id: ScreenNodeId | null) => void;
  valueCallouts: ValueCallout[];
  activeCalloutId: string | null;
  onCalloutEnter: (id: string) => void;
  onCalloutLeave: (id: string) => void;
};

function PlantFlowInner({
  season,
  focus,
  highlightedEdgeIds,
  onFocus,
  valueCallouts,
  activeCalloutId,
  onCalloutEnter,
  onCalloutLeave,
}: Props) {
  const nodesInit = useMemo(
    () => buildPlantFlowNodes(season, focus),
    [season, focus]
  );
  const edgesInit = useMemo(
    () => buildPlantFlowEdges(season, focus, highlightedEdgeIds),
    [season, focus, highlightedEdgeIds]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(nodesInit as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesInit as Edge[]);
  const didFitRef = useRef(false);

  useEffect(() => {
    setNodes(buildPlantFlowNodes(season, focus) as Node[]);
  }, [season, focus, setNodes]);

  useEffect(() => {
    setEdges(buildPlantFlowEdges(season, focus, highlightedEdgeIds) as Edge[]);
  }, [season, focus, highlightedEdgeIds, setEdges]);

  const onInit = useCallback((instance: ReactFlowInstance<Node, Edge>) => {
    if (didFitRef.current) return;
    didFitRef.current = true;
    requestAnimationFrame(() => {
      instance.fitView({
        padding: 0.1,
        maxZoom: 1.12,
        minZoom: 0.32,
        duration: 0,
      });
    });
  }, []);

  const onNodeClick = useCallback(
    (_: MouseEvent, node: Node) => {
      const id = node.id as ScreenNodeId;
      onFocus(focus === id ? null : id);
    },
    [focus, onFocus]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onInit={onInit}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={onNodeClick}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      elementsSelectable={false}
      autoPanOnNodeFocus={false}
      panOnScroll
      zoomOnScroll
      zoomOnDoubleClick={false}
      minZoom={0.32}
      maxZoom={1.85}
      className="h-full w-full !bg-transparent"
      proOptions={{ hideAttribution: true }}
    >
      <ViewportPortal>
        {valueCallouts.map((v) => {
          const tone = confidenceTone(v.confidence);
          const active = activeCalloutId === v.id;
          const left = (v.anchor.xPct / 100) * SCREEN_CANVAS.width;
          const top = (v.anchor.yPct / 100) * SCREEN_CANVAS.height;
          return (
            <button
              key={v.id}
              type="button"
              title={`${v.labelKo} / ${v.labelEn}`}
              onMouseEnter={() => onCalloutEnter(v.id)}
              onMouseLeave={() => onCalloutLeave(v.id)}
              className={cn(
                "pointer-events-auto absolute rounded border px-1.5 py-0.5 text-[9px] font-mono transition-all",
                tone,
                active &&
                  "z-10 scale-[1.04] border-[rgba(101,212,161,0.5)] shadow-[0_0_20px_rgba(101,212,161,0.22)]"
              )}
              style={{
                left,
                top,
                transform: "translate(-50%, -50%)",
              }}
            >
              <span className="mr-1 opacity-80">{v.confidence === "approx" ? "~" : ""}</span>
              <span>{v.value}</span>
              {v.unit ? <span className="ml-1 opacity-70">{v.unit}</span> : null}
              {v.confidence === "tbd" ? <span className="ml-1 text-[8px] opacity-80">TBD</span> : null}
            </button>
          );
        })}
      </ViewportPortal>
      <Background gap={22} size={1} color="rgba(101,212,161,0.06)" />
      <Controls className="!border-white/[0.12] !bg-[rgba(12,16,14,0.92)] !shadow-lg [&_button]:!fill-[var(--text-muted)] [&_button:hover]:!fill-[var(--primary-bright)] [&_button]:!border-white/[0.08] [&_button]:!bg-[rgba(20,26,22,0.95)]" />
      <MiniMap
        className="!border !border-white/[0.1] !bg-[rgba(8,12,10,0.85)]"
        nodeColor={(n) =>
          (n.data as { highlighted?: boolean })?.highlighted
            ? "rgba(101,212,161,0.65)"
            : "rgba(108,178,255,0.35)"
        }
        maskColor="rgba(0,0,0,0.45)"
      />
    </ReactFlow>
  );
}

export function GValleyPlantFlowCanvas(props: Props) {
  return (
    <div className="g-valley-flow h-[min(560px,70vh)] min-h-[420px] w-full rounded-b-lg [&_.react-flow\_\_attribution]:hidden">
      <ReactFlowProvider>
        <PlantFlowInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}

function confidenceTone(confidence: CalloutConfidence): string {
  if (confidence === "exact") {
    return "border-[rgba(108,178,255,0.45)] bg-[rgba(108,178,255,0.12)] text-[#cae5ff]";
  }
  if (confidence === "approx") {
    return "border-[rgba(246,195,68,0.45)] bg-[rgba(246,195,68,0.12)] text-[#f6d788]";
  }
  return "border-[rgba(229,115,115,0.4)] bg-[rgba(229,115,115,0.1)] text-[#f5b0b0]";
}
