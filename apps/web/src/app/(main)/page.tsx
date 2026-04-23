"use client";

import { CarbonESGTab } from "@/components/db1/carbon-tab";
import { CumulativeSavingsChart } from "@/components/db1/savings-chart";
import { EnergyComparisonChart } from "@/components/db1/energy-chart";
import { FMChatDemo } from "@/components/db1/fm-chat";
import { HVACDonut } from "@/components/db1/hvac-donut";
import { IssuesPanel } from "@/components/db1/issues-panel";
import { KPITiles } from "@/components/db1/kpi-tiles";
import { PaybackTracker } from "@/components/db1/payback-tracker";

import { panelShell } from "@/components/layout/DashboardChrome";

export default function ExecutiveSummary() {
  return (
    <div className="min-h-screen">
      <div className="pb-1">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--text-faint)] font-semibold">
          Dashboard
        </div>
        <div className="flex items-baseline gap-3 flex-wrap mt-1">
          <h1 className="text-2xl font-bold text-[var(--text)]">Executive Summary</h1>
          <span className="text-[11px] font-medium text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-2 py-0.5 rounded-full">
            DB-1
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-muted)] mt-1.5 max-w-2xl">
          Weekly performance overview for owners, CFOs, and ESG officers.
        </p>
      </div>

      <div className="space-y-6 pt-6">
        <div className={`${panelShell} p-5 md:p-6`}>
          <FMChatDemo />
        </div>

        <div className={`${panelShell} p-5 md:p-6`}>
          <KPITiles />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className={`${panelShell} p-5`}>
            <EnergyComparisonChart />
          </div>
          <div className={`${panelShell} p-5`}>
            <CumulativeSavingsChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className={`${panelShell} p-5`}>
            <IssuesPanel />
          </div>
          <div className={`${panelShell} p-5`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HVACDonut />
              <PaybackTracker />
            </div>
          </div>
        </div>

        <div className={`${panelShell} p-5 md:p-6`}>
          <CarbonESGTab />
        </div>
      </div>
    </div>
  );
}
