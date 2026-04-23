"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardChrome } from "@/components/layout/DashboardChrome";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Strategy Scorecard", href: "/optimization/scorecard" },
  { label: "Analytics & Trends", href: "/optimization/analytics" },
  { label: "M&V Baseline", href: "/optimization/mv" },
];

export default function OptimizationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <DashboardChrome maxWidth="1700px">
      <div className="min-h-screen">
        <div className="px-8 pt-7 pb-1">
          <div className="flex items-baseline gap-3">
            <h1 className="text-xl font-semibold text-[var(--text)]">Optimization & Analytics</h1>
            <span className="text-[11px] font-medium text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-2 py-0.5 rounded-full">
              DB-5
            </span>
          </div>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Are our strategies working — what does the data prove?
          </p>
        </div>

        <div className="px-8 pt-4">
          <div className="flex items-center gap-1 border-b border-[var(--border)]">
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "px-4 py-2.5 text-[13px] font-medium transition-all duration-200 relative",
                    active ? "text-[var(--primary-bright)]" : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  )}
                >
                  {tab.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--primary-bright)] rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="px-8 py-6 max-w-[1400px]">{children}</div>
      </div>
    </DashboardChrome>
  );
}
