"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Equipment Health", href: "/systems/equipment" },
  { label: "Water Side", href: "/systems/water" },
  { label: "Air Side", href: "/systems/air" },
  { label: "Zones", href: "/systems/zones" },
];

export function SystemsTabs() {
  const pathname = usePathname();

  return (
    <div
      className="flex gap-1 px-0 shrink-0 w-full max-w-[1400px] mx-auto"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "relative px-3 py-2.5 text-[13px] font-medium transition-colors",
              active
                ? "text-[var(--primary-bright)]"
                : "text-[var(--text-muted)] hover:text-[var(--text)]"
            )}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[var(--primary-bright)] rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
