"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Cooling", value: 42, color: "#52b788" },
  { name: "Heating", value: 28, color: "#2d6a4f" },
  { name: "Fans", value: 18, color: "#40916c" },
  { name: "Pumps", value: 12, color: "#6cb2ff" },
];

export function HVACDonut() {
  return (
    <div className="space-y-3 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">HVAC Energy Split</h3>
          <p className="text-[11px] text-[var(--text-faint)]">Last 30 days</p>
        </div>
        <span className="text-[11px] text-[var(--text-muted)]">Total: 1.2 GWh</span>
      </div>
      <div className="h-52">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "rgba(17,27,22,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                fontSize: 12,
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
