"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { FDDRegister } from "@/components/db6/fdd-register";
import { PipelineHealth } from "@/components/db6/pipeline-health";
import { DDCDeepDive } from "@/components/db6/ddc-deep-dive";

type Tab = "fdd" | "pipeline" | "ddc";

const tabs: { id: Tab; label: string }[] = [
  { id: "fdd", label: "FDD Register" },
  { id: "pipeline", label: "Pipeline Health" },
  { id: "ddc", label: "DDC Deep Dive" },
];

function EngineeringPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = (searchParams.get("tab") as Tab) ?? "fdd";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);

  useEffect(() => {
    const nextTab = (searchParams.get("tab") as Tab) ?? "fdd";
    setActiveTab(nextTab);
  }, [searchParams]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/engineering?${params.toString()}`);
  };

  const CurrentTab = useMemo(() => {
    if (activeTab === "pipeline") return <PipelineHealth />;
    if (activeTab === "ddc") return <DDCDeepDive />;
    return <FDDRegister />;
  }, [activeTab]);

  return (
    <div className="min-h-screen">
      <div className="px-8 pt-7 pb-1">
        <div className="flex items-baseline gap-3">
          <h1 className="text-xl font-semibold text-[var(--text)]">
            Engineering & Data
          </h1>
          <span className="text-[11px] font-medium text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-2 py-0.5 rounded-full">
            DB-6
          </span>
          <span className="text-[10px] text-[var(--text-faint)] bg-[rgba(229,115,115,0.08)] text-[#e57373] px-2 py-0.5 rounded-full">
            Internal Only
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-muted)] mt-1">
          Hidden engineering panels: FDD register, pipeline integrity, and deep
          device diagnostics.
        </p>
      </div>

      <div className="px-8 mt-6">
        <div className="flex gap-8 border-b border-[var(--border)]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "pb-3 text-[13px] font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-[var(--primary-bright)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-bright)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 py-6">{CurrentTab}</div>
    </div>
  );
}

function EngineeringFallback() {
  return (
    <div className="min-h-screen px-8 pt-7">
      <div className="h-7 w-64 rounded bg-[var(--border)]/60 animate-pulse" />
      <div className="mt-4 h-4 w-96 max-w-full rounded bg-[var(--border)]/40 animate-pulse" />
      <div className="mt-8 flex gap-8 border-b border-[var(--border)] pb-3">
        <div className="h-4 w-24 rounded bg-[var(--border)]/50 animate-pulse" />
        <div className="h-4 w-28 rounded bg-[var(--border)]/50 animate-pulse" />
        <div className="h-4 w-28 rounded bg-[var(--border)]/50 animate-pulse" />
      </div>
    </div>
  );
}

export default function EngineeringPage() {
  return (
    <Suspense fallback={<EngineeringFallback />}>
      <EngineeringPageContent />
    </Suspense>
  );
}
