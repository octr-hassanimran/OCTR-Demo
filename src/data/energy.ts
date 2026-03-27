// =============================================================================
// DB-4 Energy Hub — Synthetic Data
// =============================================================================

export type EnergyKPIs = {
  currentKw: number;
  todayPeakKw: number;
  todayPeakTime: string;
  monthPeakKw: number;
  monthPeakTime: string;
  contractLimitKw: number;
  powerFactor: number;
  eui: number; // kWh/m²/yr
  euiBenchmark: number;
};

export type SankeyFlow = {
  source: string;
  target: string;
  value: number; // kWh
};

export type MeterStatus = {
  id: string;
  name: string;
  type: "electric" | "gas" | "heat" | "water";
  isVirtual: boolean;
  lastReading: string;
  commStatus: "ok" | "stale" | "offline";
  completeness: number; // 0-100
};

export type DemandProfilePoint = {
  time: string;
  todayKw: number;
  yesterdayKw: number;
  avg7dKw: number;
};

export type CalendarHeatmapCell = {
  date: string;
  hour: number;
  kw: number;
};

export type TouBreakdown = {
  period: "peak" | "mid" | "off_peak";
  kwh: number;
  cost: number;
  pct: number;
};

export type IntervalMeterRow = {
  timestamp: string;
  meterId: string;
  meterName: string;
  kwh: number;
  kwDemand: number;
  powerFactor: number;
};

export type MonthlyCostBreakdown = {
  month: string;
  energyCharge: number;
  demandCharge: number;
  pfPenalty: number;
  reactiveCharge: number;
  total: number;
};

export type WeatherCorrelation = {
  date: string;
  oatC: number;
  dailyKwh: number;
  isAnomaly: boolean;
};

export type HVACSubmeterPoint = {
  day: string;
  chiller: number;
  fans: number;
  pumps: number;
};

export type MeterVsBmsPoint = {
  timestamp: string;
  meterKw: number;
  bmsKw: number;
};

export type LoadFactorPoint = {
  month: string;
  loadFactor: number;
};

export type DemandResponseLoad = {
  name: string;
  kw: number;
  ready: boolean;
};

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60000).toISOString();
}

function pad(num: number) {
  return String(num).padStart(2, "0");
}

// -----------------------------------------------------------------------------
// KPI Tiles
// -----------------------------------------------------------------------------

export const energyKpis: EnergyKPIs = {
  currentKw: 742,
  todayPeakKw: 855,
  todayPeakTime: "11:24",
  monthPeakKw: 912,
  monthPeakTime: "2026-03-14T15:35:00+09:00",
  contractLimitKw: 1000,
  powerFactor: 0.93,
  eui: 178,
  euiBenchmark: 165,
};

export const kpiSparklines = {
  currentKw: [698, 703, 710, 724, 731, 742],
  todayPeakKw: [812, 830, 844, 855],
  monthPeakKw: [880, 896, 905, 912],
  powerFactor: [0.9, 0.91, 0.92, 0.93, 0.935],
  eui: [184, 182, 180, 179, 178],
};

// -----------------------------------------------------------------------------
// Sub-metering + Meter Health
// -----------------------------------------------------------------------------

export const sankeyFlows: SankeyFlow[] = [
  { source: "Total Building", target: "HVAC", value: 42000 },
  { source: "Total Building", target: "Lighting", value: 18000 },
  { source: "Total Building", target: "Plug Loads", value: 15000 },
  { source: "Total Building", target: "Other", value: 8200 },
  { source: "HVAC", target: "Identified Waste", value: 3800 },
  { source: "Lighting", target: "Identified Waste", value: 920 },
  { source: "Plug Loads", target: "Identified Waste", value: 1250 },
];

export const meterStatuses: MeterStatus[] = [
  {
    id: "MTR-01",
    name: "Main Incoming",
    type: "electric",
    isVirtual: false,
    lastReading: minutesAgo(4),
    commStatus: "ok",
    completeness: 99,
  },
  {
    id: "MTR-02",
    name: "HVAC Subfeed",
    type: "electric",
    isVirtual: false,
    lastReading: minutesAgo(7),
    commStatus: "ok",
    completeness: 97,
  },
  {
    id: "MTR-03",
    name: "Lighting L1-L4",
    type: "electric",
    isVirtual: true,
    lastReading: minutesAgo(12),
    commStatus: "stale",
    completeness: 82,
  },
  {
    id: "MTR-04",
    name: "Plug Loads North",
    type: "electric",
    isVirtual: true,
    lastReading: minutesAgo(36),
    commStatus: "offline",
    completeness: 58,
  },
  {
    id: "MTR-05",
    name: "Chiller Plant",
    type: "electric",
    isVirtual: false,
    lastReading: minutesAgo(6),
    commStatus: "ok",
    completeness: 96,
  },
  {
    id: "MTR-06",
    name: "Tenant Retail",
    type: "electric",
    isVirtual: false,
    lastReading: minutesAgo(18),
    commStatus: "stale",
    completeness: 76,
  },
  {
    id: "MTR-07",
    name: "Server Room",
    type: "electric",
    isVirtual: true,
    lastReading: minutesAgo(9),
    commStatus: "ok",
    completeness: 88,
  },
  {
    id: "MTR-08",
    name: "Parking Ventilation",
    type: "electric",
    isVirtual: false,
    lastReading: minutesAgo(11),
    commStatus: "ok",
    completeness: 93,
  },
];

// -----------------------------------------------------------------------------
// Demand Profile (24H)
// -----------------------------------------------------------------------------

const baseProfile = [
  520, 500, 482, 470, 468, 488, 525, 612, 728, 810, 860, 878,
  872, 862, 850, 828, 792, 730, 668, 624, 590, 560, 540, 522,
];

export const demandProfile: DemandProfilePoint[] = baseProfile.map((v, i) => {
  const time = `${pad(i)}:00`;
  return {
    time,
    todayKw: Math.round(v * 1.02 + Math.sin(i / 3) * 8),
    yesterdayKw: Math.round(v * 1.05 + Math.cos(i / 2.8) * 10),
    avg7dKw: Math.round(v * 0.98 + Math.sin(i / 4) * 6),
  };
});

export const touWindows = [
  { label: "Peak", start: "09:00", end: "12:00" },
  { label: "Peak", start: "18:00", end: "21:00" },
];

export const monthDemandEventTime = "15:00";

// -----------------------------------------------------------------------------
// Calendar Heatmap + TOU pie
// -----------------------------------------------------------------------------

const today = new Date();

export const calendarHeatmap: CalendarHeatmapCell[] = [];

for (let d = 0; d < 30; d++) {
  const day = new Date(today.getTime() - d * 24 * 60 * 60 * 1000);
  const dateStr = day.toISOString().slice(0, 10);
  for (let h = 0; h < 24; h++) {
    const morningRamp = h >= 5 && h <= 9 ? 1 + (h - 5) * 0.1 : 1;
    const eveningRamp = h >= 17 && h <= 20 ? 1 + (h - 17) * 0.12 : 1;
    const base = 420 + Math.sin((h / 24) * Math.PI * 2) * 160;
    const noise = 12 - d * 0.3 + Math.random() * 18;
    const kw = Math.max(
      260,
      base * (morningRamp + eveningRamp - 1) + noise - d * 1.5,
    );
    calendarHeatmap.push({ date: dateStr, hour: h, kw: Math.round(kw) });
  }
}

export const touBreakdown: TouBreakdown[] = [
  { period: "peak", kwh: 42800, cost: 18200000, pct: 42 },
  { period: "mid", kwh: 32600, cost: 11800000, pct: 32 },
  { period: "off_peak", kwh: 26000, cost: 6400000, pct: 26 },
];

// -----------------------------------------------------------------------------
// Drill-downs
// -----------------------------------------------------------------------------

export const hvacSubmeterTrend: HVACSubmeterPoint[] = Array.from(
  { length: 30 },
  (_, i) => {
    const day = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
    const label = `${pad(day.getMonth() + 1)}-${pad(day.getDate())}`;
    const chiller = 1850 + Math.sin(i / 4) * 120 + Math.random() * 80;
    const fans = 620 + Math.cos(i / 3) * 60 + Math.random() * 40;
    const pumps = 410 + Math.sin(i / 2.5) * 35 + Math.random() * 30;
    return {
      day: label,
      chiller: Math.round(chiller),
      fans: Math.round(fans),
      pumps: Math.round(pumps),
    };
  },
).reverse();

export const intervalMeterRows: IntervalMeterRow[] = [
  {
    timestamp: "2026-03-27T08:00:00+09:00",
    meterId: "MTR-01",
    meterName: "Main Incoming",
    kwh: 128.4,
    kwDemand: 742,
    powerFactor: 0.93,
  },
  {
    timestamp: "2026-03-27T08:00:00+09:00",
    meterId: "MTR-02",
    meterName: "HVAC Subfeed",
    kwh: 64.1,
    kwDemand: 388,
    powerFactor: 0.92,
  },
  {
    timestamp: "2026-03-27T08:00:00+09:00",
    meterId: "MTR-03",
    meterName: "Lighting L1-L4",
    kwh: 22.4,
    kwDemand: 118,
    powerFactor: 0.97,
  },
  {
    timestamp: "2026-03-27T08:00:00+09:00",
    meterId: "MTR-04",
    meterName: "Plug Loads North",
    kwh: 18.6,
    kwDemand: 96,
    powerFactor: 0.89,
  },
  {
    timestamp: "2026-03-27T08:30:00+09:00",
    meterId: "MTR-01",
    meterName: "Main Incoming",
    kwh: 131.2,
    kwDemand: 758,
    powerFactor: 0.935,
  },
  {
    timestamp: "2026-03-27T08:30:00+09:00",
    meterId: "MTR-02",
    meterName: "HVAC Subfeed",
    kwh: 66.2,
    kwDemand: 396,
    powerFactor: 0.93,
  },
  {
    timestamp: "2026-03-27T08:30:00+09:00",
    meterId: "MTR-03",
    meterName: "Lighting L1-L4",
    kwh: 22.8,
    kwDemand: 120,
    powerFactor: 0.97,
  },
  {
    timestamp: "2026-03-27T08:30:00+09:00",
    meterId: "MTR-04",
    meterName: "Plug Loads North",
    kwh: 19.2,
    kwDemand: 98,
    powerFactor: 0.9,
  },
  {
    timestamp: "2026-03-27T09:00:00+09:00",
    meterId: "MTR-05",
    meterName: "Chiller Plant",
    kwh: 54.5,
    kwDemand: 312,
    powerFactor: 0.91,
  },
  {
    timestamp: "2026-03-27T09:00:00+09:00",
    meterId: "MTR-08",
    meterName: "Parking Ventilation",
    kwh: 12.2,
    kwDemand: 64,
    powerFactor: 0.95,
  },
];

export const meterVsBms: MeterVsBmsPoint[] = [
  { timestamp: "08:00", meterKw: 742, bmsKw: 735 },
  { timestamp: "09:00", meterKw: 812, bmsKw: 798 },
  { timestamp: "10:00", meterKw: 860, bmsKw: 842 },
  { timestamp: "11:00", meterKw: 878, bmsKw: 856 },
  { timestamp: "12:00", meterKw: 872, bmsKw: 845 },
  { timestamp: "13:00", meterKw: 862, bmsKw: 838 },
  { timestamp: "14:00", meterKw: 850, bmsKw: 832 },
  { timestamp: "15:00", meterKw: 828, bmsKw: 804 },
  { timestamp: "16:00", meterKw: 792, bmsKw: 770 },
  { timestamp: "17:00", meterKw: 730, bmsKw: 702 },
];

export const meterVsBmsThresholdKw = 25;

// -----------------------------------------------------------------------------
// Tariff & Financial Intelligence
// -----------------------------------------------------------------------------

export const monthlyCostBreakdown: MonthlyCostBreakdown[] = [
  { month: "Oct", energyCharge: 18200000, demandCharge: 7400000, pfPenalty: 380000, reactiveCharge: 510000, total: 26410000 },
  { month: "Nov", energyCharge: 17650000, demandCharge: 7120000, pfPenalty: 240000, reactiveCharge: 440000, total: 25410000 },
  { month: "Dec", energyCharge: 18180000, demandCharge: 7650000, pfPenalty: 210000, reactiveCharge: 420000, total: 26410000 },
  { month: "Jan", energyCharge: 18820000, demandCharge: 8020000, pfPenalty: 320000, reactiveCharge: 460000, total: 27652000 },
  { month: "Feb", energyCharge: 17940000, demandCharge: 7740000, pfPenalty: 180000, reactiveCharge: 410000, total: 26270000 },
  { month: "Mar", energyCharge: 17280000, demandCharge: 7910000, pfPenalty: 0, reactiveCharge: 390000, total: 25590000 },
];

export const loadFactorTrend: LoadFactorPoint[] = [
  { month: "Oct", loadFactor: 0.63 },
  { month: "Nov", loadFactor: 0.65 },
  { month: "Dec", loadFactor: 0.67 },
  { month: "Jan", loadFactor: 0.69 },
  { month: "Feb", loadFactor: 0.68 },
  { month: "Mar", loadFactor: 0.72 },
];

export const loadFactorTarget = 0.75;

export const powerFactorThreshold = 0.9;

export const demandResponse = {
  potentialKw: 68,
  loads: [
    { name: "Secondary pumps (pair)", kw: 18, ready: true },
    { name: "Lighting non-critical floors", kw: 14, ready: true },
    { name: "AHU economizer + setpoint relax", kw: 22, ready: true },
    { name: "EV chargers throttling", kw: 9, ready: false },
    { name: "Chiller reset (temporary)", kw: 5, ready: false },
  ] satisfies DemandResponseLoad[],
};

export const weatherCorrelation: WeatherCorrelation[] = [
  { date: "Mar-01", oatC: 6.2, dailyKwh: 5200, isAnomaly: false },
  { date: "Mar-02", oatC: 7.1, dailyKwh: 5250, isAnomaly: false },
  { date: "Mar-03", oatC: 9.3, dailyKwh: 5420, isAnomaly: false },
  { date: "Mar-04", oatC: 10.5, dailyKwh: 5480, isAnomaly: false },
  { date: "Mar-05", oatC: 12.4, dailyKwh: 5620, isAnomaly: false },
  { date: "Mar-06", oatC: 13.1, dailyKwh: 5710, isAnomaly: false },
  { date: "Mar-07", oatC: 14.2, dailyKwh: 5840, isAnomaly: false },
  { date: "Mar-08", oatC: 15.8, dailyKwh: 5980, isAnomaly: false },
  { date: "Mar-09", oatC: 16.5, dailyKwh: 6120, isAnomaly: false },
  { date: "Mar-10", oatC: 18.1, dailyKwh: 6280, isAnomaly: false },
  { date: "Mar-11", oatC: 19.6, dailyKwh: 6420, isAnomaly: false },
  { date: "Mar-12", oatC: 21.4, dailyKwh: 6610, isAnomaly: false },
  { date: "Mar-13", oatC: 23.2, dailyKwh: 6840, isAnomaly: false },
  { date: "Mar-14", oatC: 24.6, dailyKwh: 7120, isAnomaly: true },
  { date: "Mar-15", oatC: 22.8, dailyKwh: 6550, isAnomaly: true },
  { date: "Mar-16", oatC: 20.4, dailyKwh: 6380, isAnomaly: false },
  { date: "Mar-17", oatC: 18.9, dailyKwh: 6240, isAnomaly: false },
  { date: "Mar-18", oatC: 17.3, dailyKwh: 6060, isAnomaly: false },
  { date: "Mar-19", oatC: 15.1, dailyKwh: 5860, isAnomaly: false },
  { date: "Mar-20", oatC: 12.8, dailyKwh: 5640, isAnomaly: false },
];
