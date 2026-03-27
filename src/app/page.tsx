"use client";

import { KPITiles } from "@/components/db1/kpi-tiles";
import { EnergyComparisonChart } from "@/components/db1/energy-chart";
import { CumulativeSavingsChart } from "@/components/db1/savings-chart";
import { IssuesPanel } from "@/components/db1/issues-panel";
import { HVACDonut } from "@/components/db1/hvac-donut";
import { PaybackTracker } from "@/components/db1/payback-tracker";
import { CarbonESGTab } from "@/components/db1/carbon-tab";

export default function ExecutiveSummary() {
  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="space-y-1">
        <h1 className="text-[22px] font-bold text-[var(--text)]">Executive Summary</h1>
        <p className="text-[13px] text-[var(--text-muted)]">
          Weekly performance overview for owners, CFOs, and ESG officers.
        </p>
      </div>

      <KPITiles />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <EnergyComparisonChart />
        <CumulativeSavingsChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <IssuesPanel />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HVACDonut />
          <PaybackTracker />
        </div>
      </div>

      <CarbonESGTab />
    </div>
  );
}
