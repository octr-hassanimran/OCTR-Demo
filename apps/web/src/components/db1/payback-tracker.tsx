"use client";

export function PaybackTracker() {
  const progress = 68;

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Project Payback</h3>
          <p className="text-[11px] text-[var(--text-faint)]">Chiller optimization + lighting</p>
        </div>
        <span className="text-[11px] text-[var(--primary-bright)] font-semibold">~7.8 months</span>
      </div>
      <div className="relative h-2 rounded-full bg-white/[0.08] overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-[var(--primary)] shadow-[0_0_10px_rgba(82,183,136,0.6)]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span>Spent to date: $1.2M</span>
        <span>Recovered: $0.82M</span>
      </div>
    </div>
  );
}
