"use client";

export function Header() {
  return (
    <header
      className="h-14 flex items-center justify-between shrink-0"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <h1 className="text-[20px] font-semibold text-[var(--text)]">
            Systems Intelligence
          </h1>
          <span className="text-[11px] font-medium text-[var(--primary-bright)] bg-[rgba(82,183,136,0.1)] px-2 py-0.5 rounded-full">
            DB-3
          </span>
        </div>
        <p className="text-[13px] text-[var(--text-muted)] -mt-0.5">
          Full plant monitoring by circuit
        </p>
      </div>
      <div className="flex items-center gap-2 text-[13px] text-[var(--text-muted)]">
        <span className="w-2 h-2 rounded-full bg-[var(--primary-bright)] animate-pulse" />
        Live &bull; 2 min ago
      </div>
    </header>
  );
}
