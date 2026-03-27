export type StrategyStatus = "active" | "underperforming" | "inactive" | "na";
export type StrategyTrend = "improving" | "stable" | "worsening";

export type StrategyCard = {
  id: string;
  oehOpp: number;
  name: string;
  status: StrategyStatus;
  savingsKwh: number;
  savingsCurrency: number;
  measuredVsExpectedPct: number;
  trend: StrategyTrend;
  weeklySparkline: number[];
};

export type WeeklyAttribution = {
  week: string;
  strategies: { strategyId: string; name: string; kwh: number }[];
};

export type EffectivenessGap = {
  strategyId: string;
  name: string;
  actualKwh: number;
  potentialKwh: number;
  gap: number;
};

export type RollingEfficiency = {
  date: string;
  kwPerRt: number;
  kjPerM3: number;
  wPerM2: number;
};

export type BaselineModel = {
  scatter: { oatC: number; kw: number; timestamp: string }[];
  regression: { slope: number; intercept: number; r2: number };
  ciUpper: number[];
  ciLower: number[];
};

const KRW_PER_KWH = 220;

export const strategyCards: StrategyCard[] = [
  { id: "s1", oehOpp: 1, name: "Optimum Start/Stop", status: "active", savingsKwh: 12400, savingsCurrency: 12400 * KRW_PER_KWH, measuredVsExpectedPct: 4.6, trend: "improving", weeklySparkline: [2.8, 3.1, 3.3, 3.6] },
  { id: "s2", oehOpp: 2, name: "Setpoints & Dead Bands", status: "underperforming", savingsKwh: 8600, savingsCurrency: 8600 * KRW_PER_KWH, measuredVsExpectedPct: -6.4, trend: "worsening", weeklySparkline: [2.3, 2.1, 2.0, 1.9] },
  { id: "s3", oehOpp: 3, name: "Master SAT / Simultaneous H+C", status: "inactive", savingsKwh: 2800, savingsCurrency: 2800 * KRW_PER_KWH, measuredVsExpectedPct: -18.2, trend: "worsening", weeklySparkline: [1.2, 0.9, 0.8, 0.7] },
  { id: "s4", oehOpp: 4, name: "Chiller Staging Optimization", status: "active", savingsKwh: 20400, savingsCurrency: 20400 * KRW_PER_KWH, measuredVsExpectedPct: 6.9, trend: "improving", weeklySparkline: [4.5, 4.8, 5.1, 5.4] },
  { id: "s5", oehOpp: 5, name: "Duct Static Pressure Reset", status: "active", savingsKwh: 14800, savingsCurrency: 14800 * KRW_PER_KWH, measuredVsExpectedPct: 2.6, trend: "stable", weeklySparkline: [3.2, 3.2, 3.3, 3.2] },
  { id: "s6", oehOpp: 6, name: "Hot Water Reset", status: "active", savingsKwh: 6400, savingsCurrency: 6400 * KRW_PER_KWH, measuredVsExpectedPct: 1.7, trend: "stable", weeklySparkline: [1.4, 1.5, 1.4, 1.5] },
  { id: "s7", oehOpp: 7, name: "Chilled Water Reset", status: "active", savingsKwh: 17600, savingsCurrency: 17600 * KRW_PER_KWH, measuredVsExpectedPct: 5.2, trend: "improving", weeklySparkline: [3.9, 4.1, 4.2, 4.4] },
  { id: "s8", oehOpp: 8, name: "Condenser Water Reset", status: "underperforming", savingsKwh: 4900, savingsCurrency: 4900 * KRW_PER_KWH, measuredVsExpectedPct: -8.8, trend: "stable", weeklySparkline: [1.2, 1.1, 1.2, 1.1] },
  { id: "s9", oehOpp: 9, name: "EEV vs TXV Optimization", status: "inactive", savingsKwh: 1300, savingsCurrency: 1300 * KRW_PER_KWH, measuredVsExpectedPct: -20.5, trend: "worsening", weeklySparkline: [0.5, 0.5, 0.4, 0.4] },
  { id: "s10", oehOpp: 10, name: "Economy Cycle", status: "underperforming", savingsKwh: 10300, savingsCurrency: 10300 * KRW_PER_KWH, measuredVsExpectedPct: -4.1, trend: "stable", weeklySparkline: [2.4, 2.5, 2.5, 2.6] },
  { id: "s11", oehOpp: 11, name: "Night Purge / Pre-Cooling", status: "active", savingsKwh: 5100, savingsCurrency: 5100 * KRW_PER_KWH, measuredVsExpectedPct: 1.1, trend: "stable", weeklySparkline: [1.2, 1.3, 1.3, 1.3] },
  { id: "s12", oehOpp: 12, name: "Demand Controlled Ventilation", status: "active", savingsKwh: 6900, savingsCurrency: 6900 * KRW_PER_KWH, measuredVsExpectedPct: 3.2, trend: "improving", weeklySparkline: [1.4, 1.5, 1.6, 1.7] },
  { id: "s13", oehOpp: 13, name: "Demand Response / Peak Shaving", status: "underperforming", savingsKwh: 3800, savingsCurrency: 3800 * KRW_PER_KWH, measuredVsExpectedPct: -2.7, trend: "stable", weeklySparkline: [0.8, 0.9, 1.0, 1.1] },
  { id: "s14", oehOpp: 14, name: "CHW Pump ΔP Reset", status: "active", savingsKwh: 7800, savingsCurrency: 7800 * KRW_PER_KWH, measuredVsExpectedPct: 2.8, trend: "improving", weeklySparkline: [1.8, 1.9, 2.0, 2.1] },
  { id: "s15", oehOpp: 15, name: "VSD Optimization (Pumps)", status: "active", savingsKwh: 7200, savingsCurrency: 7200 * KRW_PER_KWH, measuredVsExpectedPct: 2.3, trend: "stable", weeklySparkline: [1.6, 1.7, 1.7, 1.8] },
  { id: "s16", oehOpp: 16, name: "VSD Optimization (Fans)", status: "active", savingsKwh: 9100, savingsCurrency: 9100 * KRW_PER_KWH, measuredVsExpectedPct: 3.5, trend: "improving", weeklySparkline: [2.0, 2.1, 2.2, 2.4] },
  { id: "s17", oehOpp: 17, name: "Thermal Storage Optimization", status: "active", savingsKwh: 3400, savingsCurrency: 3400 * KRW_PER_KWH, measuredVsExpectedPct: 1.6, trend: "improving", weeklySparkline: [0.7, 0.8, 0.9, 1.0] },
  { id: "s18", oehOpp: 18, name: "Simultaneous Heat/Cool Avoidance", status: "underperforming", savingsKwh: 4200, savingsCurrency: 4200 * KRW_PER_KWH, measuredVsExpectedPct: -3.4, trend: "worsening", weeklySparkline: [1.2, 1.1, 1.0, 0.9] },
  { id: "s19", oehOpp: 19, name: "Filter Maintenance Optimization", status: "inactive", savingsKwh: 2200, savingsCurrency: 2200 * KRW_PER_KWH, measuredVsExpectedPct: -15.4, trend: "worsening", weeklySparkline: [0.9, 0.8, 0.7, 0.7] },
  { id: "s20", oehOpp: 20, name: "BMS Software & Controls Audit", status: "active", savingsKwh: 4500, savingsCurrency: 4500 * KRW_PER_KWH, measuredVsExpectedPct: 1.4, trend: "stable", weeklySparkline: [1.0, 1.0, 1.1, 1.1] },
];

export const topDeepDives = [1, 2, 5, 7, 10] as const;

export const ossScatter = Array.from({ length: 28 }, (_, i) => {
  const optimal = 6.2 + (i % 5) * 0.1;
  const actual = optimal + (i % 6 === 0 ? 1.2 : i % 4 === 0 ? 0.6 : 0.15);
  return { day: `D${i + 1}`, optimal, actual, onTime: actual <= optimal + 0.25 };
});

export const ossMonthlyHours = [
  { month: "Oct", hoursSaved: 48 },
  { month: "Nov", hoursSaved: 53 },
  { month: "Dec", hoursSaved: 58 },
  { month: "Jan", hoursSaved: 62 },
];

export const deadBandHistogram = [
  { band: "0-1C", zones: 4 },
  { band: "1-2C", zones: 9 },
  { band: "2-3C", zones: 24 },
  { band: "3-4C", zones: 11 },
  { band: "4-5C", zones: 6 },
];

export const deadBandCompliance = Array.from({ length: 24 }, (_, i) => ({
  zone: `Z-${String(i + 1).padStart(2, "0")}`,
  compliant: i % 5 !== 0,
}));

export const dsprLine = Array.from({ length: 30 }, (_, i) => ({
  t: `W${Math.floor(i / 7) + 1}D${(i % 7) + 1}`,
  actual: 186 + Math.sin(i / 4) * 9,
  optimal: 174 + Math.sin(i / 4) * 6,
}));

export const chwResetDual = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  chws: 7.2 - i * 0.03,
  optimalChws: 6.9 - i * 0.035,
  kwrt: 0.66 - i * 0.003 + Math.sin(i / 5) * 0.01,
  optimalKwrt: 0.6 - i * 0.0032 + Math.sin(i / 5) * 0.008,
}));

export const economyBars = [
  { month: "Oct", active: 118, available: 210 },
  { month: "Nov", active: 126, available: 218 },
  { month: "Dec", active: 139, available: 227 },
  { month: "Jan", active: 151, available: 235 },
];

export const weeklyAttribution: WeeklyAttribution[] = [
  { week: "W1", strategies: [{ strategyId: "s4", name: "Chiller Staging", kwh: 4300 }, { strategyId: "s7", name: "CHW Reset", kwh: 3600 }, { strategyId: "s1", name: "OSS", kwh: 2800 }, { strategyId: "s5", name: "DSPR", kwh: 2400 }] },
  { week: "W2", strategies: [{ strategyId: "s4", name: "Chiller Staging", kwh: 4500 }, { strategyId: "s7", name: "CHW Reset", kwh: 3800 }, { strategyId: "s1", name: "OSS", kwh: 2900 }, { strategyId: "s10", name: "Economy", kwh: 2500 }] },
  { week: "W3", strategies: [{ strategyId: "s4", name: "Chiller Staging", kwh: 4700 }, { strategyId: "s7", name: "CHW Reset", kwh: 3900 }, { strategyId: "s5", name: "DSPR", kwh: 2600 }, { strategyId: "s10", name: "Economy", kwh: 2400 }] },
  { week: "W4", strategies: [{ strategyId: "s4", name: "Chiller Staging", kwh: 4900 }, { strategyId: "s7", name: "CHW Reset", kwh: 4100 }, { strategyId: "s1", name: "OSS", kwh: 3200 }, { strategyId: "s16", name: "VSD Fans", kwh: 2200 }] },
];

export const effectivenessGaps: EffectivenessGap[] = [
  { strategyId: "s2", name: "Opp. 2 - Setpoints", actualKwh: 8600, potentialKwh: 12400, gap: 3800 },
  { strategyId: "s10", name: "Opp. 10 - Economy Cycle", actualKwh: 10300, potentialKwh: 13800, gap: 3500 },
  { strategyId: "s8", name: "Opp. 8 - Condenser Reset", actualKwh: 4900, potentialKwh: 7900, gap: 3000 },
  { strategyId: "s9", name: "Opp. 9 - EEV/TXV", actualKwh: 1300, potentialKwh: 3900, gap: 2600 },
  { strategyId: "s3", name: "Opp. 3 - SAT/H+C", actualKwh: 2800, potentialKwh: 5100, gap: 2300 },
];

export const rollingEfficiency: RollingEfficiency[] = Array.from(
  { length: 30 },
  (_, i) => ({
    date: `Jan ${i + 1}`,
    kwPerRt: 0.66 - i * 0.0018 + Math.sin(i / 3) * 0.01,
    kjPerM3: 44 - i * 0.06 + Math.cos(i / 4) * 0.35,
    wPerM2: 82 - i * 0.25 + Math.sin(i / 5) * 1.2,
  })
);

export const forecast48h = Array.from({ length: 48 }, (_, i) => {
  const predicted = 440 + Math.sin(i / 6) * 36 + (i % 7) * 4;
  return {
    h: `+${i}h`,
    predicted,
    upper: predicted + 32,
    lower: predicted - 32,
    actual: i < 16 ? predicted + (i % 3 === 0 ? 8 : -5) : null,
  };
});

export const anomalySeries = Array.from({ length: 42 }, (_, i) => {
  const base = Math.sin(i / 3) * 1.2;
  const spike = i === 13 ? 2.9 : i === 28 ? -3.1 : 0;
  return {
    t: `D${i + 1}`,
    z: base + spike,
    classification: i === 13 ? "Schedule mismatch" : i === 28 ? "Sensor drift" : "",
  };
});

export const driftRows = [
  { id: "AHU-03-SAT", sensor: "AHU-03 Supply Air Temp", avg7d: 15.9, baseline30d: 15.0, driftPct: 6.0 },
  { id: "CH-01-KW", sensor: "Chiller-01 Power", avg7d: 428, baseline30d: 405, driftPct: 5.7 },
  { id: "VAV-12-FLOW", sensor: "VAV-12 Airflow", avg7d: 1240, baseline30d: 1175, driftPct: 5.5 },
];

export const decomposition = Array.from({ length: 48 }, (_, i) => ({
  t: `M${i + 1}`,
  trend: 420 + i * 2.2,
  seasonal: Math.sin(i / 2.8) * 16,
  residual: Math.cos(i / 2.3) * 5,
}));

export const baselineModel: BaselineModel = (() => {
  const scatter = Array.from({ length: 36 }, (_, i) => {
    const oatC = 8 + i * 0.65;
    const kw = 115 + oatC * 8.6 + Math.sin(i) * 11;
    return { oatC, kw, timestamp: `2025-01-${String((i % 28) + 1).padStart(2, "0")}` };
  });
  const slope = 8.6;
  const intercept = 115;
  const r2 = 0.88;
  const ciUpper = scatter.map((p) => slope * p.oatC + intercept + 24);
  const ciLower = scatter.map((p) => slope * p.oatC + intercept - 24);
  return { scatter, regression: { slope, intercept, r2 }, ciUpper, ciLower };
})();

export const mvSeries = Array.from({ length: 31 }, (_, i) => {
  const adjusted = 14500 + Math.sin(i / 5) * 380 + i * 10;
  const actual = adjusted - (420 + Math.sin(i / 4) * 85);
  return {
    t: `Jan ${i + 1}`,
    adjusted,
    actual,
    savings: adjusted - actual,
    ciUpper: adjusted - actual + 85,
    ciLower: adjusted - actual - 85,
  };
});

export const caeSeries = Array.from({ length: 18 }, (_, i) => ({
  t: `M${i + 1}`,
  cae: 140 + i * 22 + (i % 3) * 2,
  milestone: i === 5 || i === 11 || i === 16,
}));

export const weatherNormEui = [
  { period: "Pre-Opt", eui: 122 },
  { period: "Y1-Q1", eui: 115 },
  { period: "Y1-Q2", eui: 110 },
  { period: "Y1-Q3", eui: 104 },
  { period: "Y1-Q4", eui: 100 },
  { period: "Y2-Q1", eui: 95 },
];

export const paybackRows = [
  { strategyId: "s1", name: "Opp. 1 - OSS", investment: 42000000, savingsToDate: 16800000, revisedPaybackMonths: 15, originalEstimateMonths: 18, spark: [3, 6, 9, 12, 14, 16.8] },
  { strategyId: "s5", name: "Opp. 5 - DSPR", investment: 36000000, savingsToDate: 15200000, revisedPaybackMonths: 16, originalEstimateMonths: 19, spark: [2, 5, 8, 11, 13, 15.2] },
  { strategyId: "s7", name: "Opp. 7 - CHW Reset", investment: 38000000, savingsToDate: 20800000, revisedPaybackMonths: 12, originalEstimateMonths: 15, spark: [4, 8, 12, 15, 18, 20.8] },
  { strategyId: "s10", name: "Opp. 10 - Economy", investment: 22000000, savingsToDate: 9800000, revisedPaybackMonths: 18, originalEstimateMonths: 16, spark: [1, 2.5, 4.2, 6.1, 7.8, 9.8] },
];

export const waterfall = [
  { name: "Opp. 4 Chiller Staging", kwh: 20400 },
  { name: "Opp. 7 CHW Reset", kwh: 17600 },
  { name: "Opp. 5 DSPR", kwh: 14800 },
  { name: "Opp. 1 OSS", kwh: 12400 },
  { name: "Opp. 10 Economy", kwh: 10300 },
];

export const totalStrategySavingsKwh = strategyCards.reduce(
  (acc, s) => acc + s.savingsKwh,
  0
);
