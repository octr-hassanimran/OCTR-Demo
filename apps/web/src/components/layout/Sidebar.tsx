"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Activity,
  Cpu,
  Zap,
  TrendingUp,
  Wrench,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Executive Summary", href: "/", icon: LayoutDashboard, db: "DB-1" },
  { label: "Live Operations", href: "/operations", icon: Activity, db: "DB-2" },
  { label: "Systems Intelligence", href: "/systems", icon: Cpu, db: "DB-3" },
  { label: "Energy Hub", href: "/energy", icon: Zap, db: "DB-4" },
  { label: "Optimization", href: "/optimization", icon: TrendingUp, db: "DB-5" },
  { label: "Engineering", href: "/engineering", icon: Wrench, db: "DB-6" },
  { label: "Design Lab", href: "/design-lab", icon: Sparkles, db: "Design" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] h-screen flex-shrink-0 bg-[var(--surface)] border-r border-[var(--border)] flex flex-col">
      <div className="h-14 flex items-center gap-2.5 px-5 border-b border-[var(--border)]">
        <div className="h-8 w-8 rounded-md bg-[rgba(82,183,136,0.14)] ring-1 ring-[var(--border)] flex items-center justify-center">
          <Image
            src="/assets/octr-logo-mark.png"
            alt="OCTR mark"
            width={20}
            height={20}
            className="h-5 w-5 object-contain brightness-0 invert opacity-90"
            priority
          />
        </div>
        <div className="min-w-0 leading-tight">
          <div className="text-[14px] font-semibold tracking-[0.08em] text-[var(--text)]">
            OCTR
          </div>
          <div className="text-[10px] text-[var(--text-faint)] -mt-0.5">
            Energy Platform
          </div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2.5 space-y-0.5">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.db}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-200 border border-transparent overflow-hidden",
                isActive
                  ? "text-[var(--primary-bright)] font-semibold bg-[rgba(82,183,136,0.08)] border-[rgba(82,183,136,0.35)] shadow-[0_0_0_1px_rgba(82,183,136,0.22),0_12px_28px_rgba(64,145,108,0.16)] before:absolute before:inset-[-20%] before:bg-[radial-gradient(circle_at_20%_20%,rgba(82,183,136,0.22),transparent_55%)] before:opacity-80 before:pointer-events-none"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)] hover:border-[rgba(82,183,136,0.25)] hover:shadow-[0_0_0_1px_rgba(82,183,136,0.18),0_10px_22px_rgba(64,145,108,0.12)]"
              )}
            >
              <Icon
                className={cn(
                  "w-[16px] h-[16px] flex-shrink-0 transition-transform duration-200",
                  isActive ? "scale-105 drop-shadow-[0_0_6px_rgba(82,183,136,0.55)]" : "group-hover:translate-x-[1px]"
                )}
              />
              <span className="truncate relative z-[1]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-[var(--border)]">
        <div className="text-[11px] text-[var(--text-faint)]">
          OCTR Energy Platform
        </div>
        <div className="text-[10px] text-[var(--text-faint)] mt-0.5 opacity-60">
          v0.1.0 — Demo
        </div>
      </div>
    </aside>
  );
}
