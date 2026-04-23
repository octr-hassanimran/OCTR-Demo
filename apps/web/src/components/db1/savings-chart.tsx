"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const savingsData = [
  { month: "Jan", cumulative: 0.8 },
  { month: "Feb", cumulative: 1.6 },
  { month: "Mar", cumulative: 2.9 },
  { month: "Apr", cumulative: 4.1 },
  { month: "May", cumulative: 5.5 },
  { month: "Jun", cumulative: 7.2 },
  { month: "Jul", cumulative: 8.9 },
  { month: "Aug", cumulative: 10.2 },
  { month: "Sep", cumulative: 11.5 },
  { month: "Oct", cumulative: 13.1 },
  { month: "Nov", cumulative: 14.7 },
  { month: "Dec", cumulative: 16.4 },
];

export function CumulativeSavingsChart() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text)]">Cumulative Savings</h3>
          <p className="text-[11px] text-[var(--text-faint)]">Energy + Opex, $M</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={savingsData} margin={{ left: 0, right: 0 }}>
            <defs>
              <linearGradient id="savings-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#52b788" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#52b788" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#a7c4b5", fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: "#a7c4b5", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v.toFixed(0)}M`}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(17,27,22,0.95)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(value: number) => [`$${value.toFixed(1)}M`, "Cumulative"]}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="#52b788"
              strokeWidth={2}
              fill="url(#savings-fill)"
              isAnimationActive={false}
              dot={{ r: 3, fill: "#52b788", strokeWidth: 0 }}
              style={{ filter: "drop-shadow(0 0 6px rgba(82,183,136,0.5))" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
