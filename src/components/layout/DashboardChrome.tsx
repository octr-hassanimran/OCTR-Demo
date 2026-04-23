"use client";

import type { CSSProperties, ReactNode } from "react";

const dashboardTheme: CSSProperties = {
  "--bg": "#0b0f14",
  "--surface": "rgba(27,31,38,0.9)",
  "--surface-hover": "rgba(32,37,46,0.95)",
  "--border": "rgba(255,255,255,0.08)",
  "--text": "#edf1f4",
  "--text-muted": "#aeb6c2",
  "--text-faint": "#7f8b99",
  "--primary": "#4fa07a",
  "--primary-bright": "#65d4a1",
  "--primary-soft": "#3d8c6a",
  "--gradient-hero":
    "radial-gradient(circle at 20% 15%, rgba(101,212,161,0.12), transparent 32%), radial-gradient(circle at 80% 5%, rgba(108,178,255,0.18), transparent 38%), linear-gradient(135deg, #0b0f14 0%, #0d1118 60%, #0b0f14 100%)",
  "--danger": "#e57373",
  "--warning": "#f6c344",
  "--info": "#6cb2ff",
} as CSSProperties;

export const panelShell =
  "rounded-2xl border border-white/[0.08] bg-[rgba(24,28,35,0.9)] backdrop-blur-md shadow-[0_20px_60px_rgba(0,0,0,0.35)]";

export function DashboardChrome({
  children,
  maxWidth = "1600px",
}: {
  children: ReactNode;
  maxWidth?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden" style={dashboardTheme}>
      <div className="absolute inset-0 bg-[#070a0f]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.04),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(101,212,161,0.12),transparent_36%),radial-gradient(circle_at_40%_80%,rgba(108,178,255,0.08),transparent_34%)] opacity-70" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          opacity: 0.18,
        }}
      />

      <div className="relative p-6 md:p-8 mx-auto w-full" style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
