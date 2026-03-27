"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Water Side", href: "/systems/water" },
  { label: "Air Side", href: "/systems/air" },
  { label: "Zones", href: "/systems/zones" },
  { label: "Equipment Health", href: "/systems/equipment" },
];

export function SystemsTabs() {
  const pathname = usePathname();

  return (
    <div
      className="flex gap-1 px-6 shrink-0"
      style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
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
                ? "text-[#52b788]"
                : "text-[#a7c4b5] hover:text-[#e8f5e9]"
            )}
          >
            {tab.label}
            {active && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#52b788] rounded-full" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
