"use client";

import { useState } from "react";
import { DDCStatusRibbon } from "@/components/operations/DDCStatusRibbon";
import { PrioritizedActionList } from "@/components/operations/PrioritizedActionList";
import { FaultDetailPanel } from "@/components/operations/FaultDetailPanel";
import { DemandCurve } from "@/components/operations/DemandCurve";
import { AlertHeatmap } from "@/components/operations/AlertHeatmap";
import type { PrioritizedFault } from "@/data/operations";

export default function OperationsPage() {
  const [selectedFault, setSelectedFault] =
    useState<PrioritizedFault | null>(null);

  return (
    <div className="min-h-screen">
      <div className="px-8 pt-7 pb-1">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-[var(--text)]">
            Live Operations
          </h1>
          <span className="text-[11px] font-medium text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-2 py-0.5 rounded-full">
            DB-2
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Real-time controller status and prioritized fault management
        </p>
      </div>

      <div className="px-8 py-5 space-y-6">
        <section>
          <SectionLabel>DDC Controller Status</SectionLabel>
          <DDCStatusRibbon />
        </section>

        <section>
          <SectionLabel>Priority Actions</SectionLabel>
          <PrioritizedActionList onSelectFault={setSelectedFault} />
        </section>

        <section>
          <DemandCurve />
        </section>

        <section>
          <AlertHeatmap />
        </section>
      </div>

      <FaultDetailPanel
        fault={selectedFault}
        onClose={() => setSelectedFault(null)}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[11px] font-semibold text-[var(--text-faint)] uppercase tracking-widest mb-3">
      {children}
    </h2>
  );
}
