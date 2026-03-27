"use client";

export function CarbonESGTab() {
  const rows = [
    { label: "Scope 1", value: "18.4 tCO₂e", trend: "Stable" },
    { label: "Scope 2", value: "92.1 tCO₂e", trend: "−6.2% MoM" },
    { label: "Renewables", value: "24% mix", trend: "Up 3 pts" },
  ];

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-md p-5 space-y-3">
      <div>
        <h2 className="text-lg font-semibold text-[var(--text)]">Carbon & ESG</h2>
        <p className="text-[12px] text-[var(--text-faint)]">
          Quick view of scopes, renewable mix, and trajectory.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {rows.map((r) => (
          <div
            key={r.label}
            className="p-4 rounded-md border border-[var(--border)] bg-[rgba(255,255,255,0.02)]"
          >
            <div className="text-[11px] text-[var(--text-faint)] uppercase tracking-widest">
              {r.label}
            </div>
            <div className="text-xl font-bold text-[var(--text)]">{r.value}</div>
            <div className="text-[11px] text-[var(--primary-bright)]">{r.trend}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
