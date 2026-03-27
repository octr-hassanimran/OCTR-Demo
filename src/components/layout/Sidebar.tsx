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
  Building2,
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
        <Image
          src="/assets/octr-logo-full.png"
          alt="OCTR logo"
          width={120}
          height={28}
          className="h-7 w-auto"
          priority
        />
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
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-all duration-200",
                isActive
                  ? "bg-[rgba(82,183,136,0.12)] text-[var(--primary-bright)] font-medium"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]"
              )}
            >
              <Icon className="w-[16px] h-[16px] flex-shrink-0" />
              <span className="truncate">{item.label}</span>
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
