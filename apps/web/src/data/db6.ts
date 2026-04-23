// =============================================================================
// DB-6 Engineering & Data — Synthetic Data
// =============================================================================

export type FDDFault = {
  id: string;
  faultType: string;
  description?: string;
  oehOpp: number;
  equipment: string;
  firstDetected: string;
  durationDays: number;
  kwhPerDayWaste: number;
  severity: "high" | "med" | "low";
  status: "open" | "ack" | "closed";
  resolvedDate?: string;
  savedKwh?: number;
};

export type FDDRule = {
  id: string;
  name: string;
  oehOpp: number;
  condition: string;
  thresholds: Record<string, number>;
  enabled: boolean;
};

export type FaultPriorityPoint = {
  id: string;
  faultId: string;
  faultType: string;
  daysActive: number;
  severityScore: number;
  kwhPerDayWaste: number;
  severity: "high" | "med" | "low";
};

export type FaultResolutionHistogram = {
  bucket: string;
  count: number;
};

export type FaultSavingsBar = {
  faultType: string;
  savedKwh: number;
};

export type FaultAgeBucket = {
  bucket: string;
  count: number;
};

export type DDCPipelineStatus = {
  ddcId: string;
  name: string;
  lastRawReading: string;
  curatedLagMinutes: number;
  pointsCount: number;
  errorRatePct: number;
};

export type RunFolderCell = {
  ddcId: string;
  hour: number;
  completeness: number; // 0-1
};

export type DataQualityCell = {
  ddcId: string;
  date: string;
  status: "ok" | "missing" | "outlier" | "stuck";
  flaggedPoints?: string[];
};

export type SensorCrossCheck = {
  pair: string;
  expectedCorrelation: string;
  divergence: string;
  duration: string;
  affectedStrategies: string;
  note?: string;
};

export type InfraHealthPoint = {
  time: string;
  usedTb: number;
  capacityTb: number;
};

export type ServiceHealth = {
  name: string;
  uptimePct: number;
  lastRestart: string;
  errorCount24h: number;
  coldStarts7d?: number;
  status: "ok" | "warn" | "down";
};

export type DDCPoint = {
  name: string;
  currentValue: number | boolean;
  trend1h: "up" | "down" | "stable";
  unit: string;
  pointClass: "AI" | "AO" | "BI" | "BO" | "AV" | "BV";
  qualityFlag: "ok" | "suspect" | "missing";
};

export type PointStats = {
  name: string;
  min: number;
  mean: number;
  max: number;
  stdDev: number;
  last: number;
};

export type BinaryStateSegment = {
  start: string;
  end: string;
  state: "on" | "off" | "fault";
};

export type BinaryTimeline = {
  point: string;
  segments: BinaryStateSegment[];
};

export type BoxPlotSeries = {
  point: string;
  stats: [number, number, number, number, number]; // min, q1, median, q3, max
};

export type QualityFlagSegment = {
  point: string;
  segments: {
    start: string;
    end: string;
    status: "ok" | "suspect" | "missing";
  }[];
};

export type RawDataRow = {
  timestamp: string;
  point: string;
  value: number;
  unit: string;
  qualityFlag: "ok" | "suspect" | "missing";
};

// ---------------------------------------------------------------------------
// 1. FDD Register Data
// ---------------------------------------------------------------------------

export const fddFaults: FDDFault[] = [
  {
    id: "FDD-001",
    faultType: "Simultaneous H+C",
    oehOpp: 3,
    equipment: "AHU-03",
    description:
      "Heating and cooling valves > 30% open together. Likely SAT loop conflict.",
    firstDetected: "2026-03-24T08:15:00Z",
    durationDays: 3,
    kwhPerDayWaste: 280,
    severity: "high",
    status: "open",
  },
  {
    id: "FDD-002",
    faultType: "Economy Cycle Disabled",
    oehOpp: 10,
    equipment: "AHU-01",
    description:
      "Economizer disabled while OAT 12–18°C. Missed free cooling hours.",
    firstDetected: "2026-03-21T10:30:00Z",
    durationDays: 6,
    kwhPerDayWaste: 190,
    severity: "high",
    status: "open",
  },
  {
    id: "FDD-003",
    faultType: "OSS Early Start",
    oehOpp: 1,
    equipment: "Building-wide",
    description:
      "HVAC starting 90 min early vs occupancy schedule. Overheating unoccupied hours.",
    firstDetected: "2026-03-06T05:30:00Z",
    durationDays: 21,
    kwhPerDayWaste: 150,
    severity: "med",
    status: "ack",
  },
  {
    id: "FDD-004",
    faultType: "DSPR Fixed",
    oehOpp: 5,
    equipment: "AHU-02",
    description:
      "Duct static pressure fixed at max. VAVs < 50% open; fan energy wasted.",
    firstDetected: "2026-03-25T14:20:00Z",
    durationDays: 2,
    kwhPerDayWaste: 90,
    severity: "med",
    status: "open",
  },
  {
    id: "FDD-005",
    faultType: "Dead band fault",
    oehOpp: 2,
    equipment: "VAV-5E-01",
    description:
      "Zone deadband < 1°C; oscillating between heating/cooling causing reheat waste.",
    firstDetected: "2026-03-22T09:00:00Z",
    durationDays: 5,
    kwhPerDayWaste: 65,
    severity: "med",
    status: "open",
  },
  {
    id: "FDD-006",
    faultType: "Over-ventilation",
    oehOpp: 12,
    equipment: "VAV-3C-01",
    description: "CO₂ < 600 ppm but OA damper 100% — DCV not modulating.",
    firstDetected: "2026-03-26T11:45:00Z",
    durationDays: 1,
    kwhPerDayWaste: 45,
    severity: "low",
    status: "open",
  },
  {
    id: "FDD-007",
    faultType: "CW reset disabled",
    oehOpp: 8,
    equipment: "CT-02",
    description:
      "Condenser water reset disabled; return temp 2.5°C above setpoint.",
    firstDetected: "2026-03-23T13:10:00Z",
    durationDays: 4,
    kwhPerDayWaste: 35,
    severity: "low",
    status: "open",
  },
  {
    id: "FDD-008",
    faultType: "CHW reset disabled",
    oehOpp: 7,
    equipment: "Chiller Plant",
    description:
      "CHWS setpoint fixed regardless of load. Lift higher than optimal during shoulder hours.",
    firstDetected: "2026-03-18T07:00:00Z",
    durationDays: 9,
    kwhPerDayWaste: 55,
    severity: "med",
    status: "closed",
    resolvedDate: "2026-03-26",
    savedKwh: 1800,
  },
  {
    id: "FDD-009",
    faultType: "Pump ΔP reset disabled",
    oehOpp: 14,
    equipment: "CHW Pump Loop",
    description:
      "Differential pressure fixed at design; pumps running at high speed all day.",
    firstDetected: "2026-03-20T06:20:00Z",
    durationDays: 7,
    kwhPerDayWaste: 70,
    severity: "med",
    status: "ack",
  },
];

export const fddRules: FDDRule[] = [
  {
    id: "RULE-01",
    name: "OSS early-start",
    oehOpp: 1,
    condition: "HVAC starts > 90 min before occupancy on OA < 20°C days",
    thresholds: { preStartMaxMin: 90, oatThreshold: 20 },
    enabled: true,
  },
  {
    id: "RULE-02",
    name: "Dead band fault",
    oehOpp: 2,
    condition: "zone dead band < 1°C",
    thresholds: { minDeadband: 1 },
    enabled: true,
  },
  {
    id: "RULE-03",
    name: "Simultaneous H+C",
    oehOpp: 3,
    condition: "heating AND cooling valves both > 30% open",
    thresholds: { valveThreshold: 30 },
    enabled: true,
  },
  {
    id: "RULE-04",
    name: "Poor chiller staging",
    oehOpp: 4,
    condition: "two chillers each < 35% load when one at 70% is more efficient",
    thresholds: { loadThreshold: 35, efficiencyThreshold: 70 },
    enabled: true,
  },
  {
    id: "RULE-05",
    name: "DSPR disabled",
    oehOpp: 5,
    condition: "duct pressure fixed despite most VAV boxes < 50% open",
    thresholds: { vavOpenThreshold: 50 },
    enabled: true,
  },
  {
    id: "RULE-06",
    name: "CHW reset disabled",
    oehOpp: 7,
    condition: "CHWS setpoint fixed regardless of load",
    thresholds: { chwLiftMax: 8 },
    enabled: true,
  },
  {
    id: "RULE-07",
    name: "CW reset disabled",
    oehOpp: 8,
    condition: "condenser water fixed despite cool ambient",
    thresholds: { cwTempMax: 30 },
    enabled: true,
  },
  {
    id: "RULE-08",
    name: "Missed economy cycle",
    oehOpp: 10,
    condition: "OA enthalpy < 52 kJ/kg but economy not active",
    thresholds: { enthalpyThreshold: 52 },
    enabled: true,
  },
  {
    id: "RULE-09",
    name: "Night purge fault",
    oehOpp: 11,
    condition: "space > 25°C at 05:00 but purge not activated",
    thresholds: { purgeStart: 5 },
    enabled: true,
  },
  {
    id: "RULE-10",
    name: "Over-ventilation",
    oehOpp: 12,
    condition: "CO₂ < 600 ppm with OA damper 100% open",
    thresholds: { co2Max: 600 },
    enabled: true,
  },
  {
    id: "RULE-11",
    name: "Pump ΔP reset disabled",
    oehOpp: 14,
    condition: "CHW differential pressure at fixed value",
    thresholds: { dpMax: 150 },
    enabled: true,
  },
];

export const faultPriorityPoints: FaultPriorityPoint[] = fddFaults.map((f) => ({
  id: `PRI-${f.id}`,
  faultId: f.id,
  faultType: f.faultType,
  daysActive: f.durationDays,
  severityScore: f.severity === "high" ? 90 : f.severity === "med" ? 60 : 30,
  kwhPerDayWaste: f.kwhPerDayWaste,
  severity: f.severity,
}));

export const faultResolutionHistogram: FaultResolutionHistogram[] = [
  { bucket: "0-2d", count: 3 },
  { bucket: "3-5d", count: 5 },
  { bucket: "6-10d", count: 4 },
  { bucket: "11-20d", count: 3 },
  { bucket: "20+d", count: 2 },
];

export const faultSavingsBars: FaultSavingsBar[] = [
  { faultType: "DSPR Fixed", savedKwh: 4200 },
  { faultType: "Simultaneous H+C", savedKwh: 6800 },
  { faultType: "Economy Cycle Disabled", savedKwh: 5200 },
  { faultType: "Over-ventilation", savedKwh: 2400 },
  { faultType: "CHW reset disabled", savedKwh: 1800 },
];

export const faultAgeBuckets: FaultAgeBucket[] = [
  { bucket: "<1d", count: 2 },
  { bucket: "1-3d", count: 3 },
  { bucket: "4-7d", count: 4 },
  { bucket: "8-14d", count: 2 },
  { bucket: "15+d", count: 1 },
];

// ---------------------------------------------------------------------------
// 2. Pipeline Health Data
// ---------------------------------------------------------------------------

export const pipelineStatuses: DDCPipelineStatus[] = [
  {
    ddcId: "DDC-01",
    name: "Chiller Plant",
    lastRawReading: "2026-03-27T10:42:00Z",
    curatedLagMinutes: 2,
    pointsCount: 342,
    errorRatePct: 0.02,
  },
  {
    ddcId: "DDC-02",
    name: "AHU-01 Lobby",
    lastRawReading: "2026-03-27T10:43:00Z",
    curatedLagMinutes: 1,
    pointsCount: 186,
    errorRatePct: 0.05,
  },
  {
    ddcId: "DDC-03",
    name: "AHU-02 Flrs 1-3",
    lastRawReading: "2026-03-27T10:41:00Z",
    curatedLagMinutes: 3,
    pointsCount: 178,
    errorRatePct: 0.12,
  },
  {
    ddcId: "DDC-04",
    name: "AHU-03 Flrs 4-7",
    lastRawReading: "2026-03-27T10:40:00Z",
    curatedLagMinutes: 4,
    pointsCount: 164,
    errorRatePct: 0.08,
  },
  {
    ddcId: "DDC-05",
    name: "VAV Floor 1-3",
    lastRawReading: "2026-03-27T10:43:00Z",
    curatedLagMinutes: 1,
    pointsCount: 520,
    errorRatePct: 0.01,
  },
  {
    ddcId: "DDC-07",
    name: "VAV Floor 7-9",
    lastRawReading: "2026-03-27T10:32:00Z",
    curatedLagMinutes: 12,
    pointsCount: 502,
    errorRatePct: 2.4,
  },
  {
    ddcId: "DDC-10",
    name: "BMS Gateway",
    lastRawReading: "2026-03-27T09:56:00Z",
    curatedLagMinutes: 48,
    pointsCount: 64,
    errorRatePct: 15.2,
  },
];

const hours = Array.from({ length: 24 }, (_, i) => i);
const ddcForRunFolder = ["DDC-01", "DDC-02", "DDC-03", "DDC-04", "DDC-05", "DDC-07", "DDC-10"];

export const runFolderCompleteness: RunFolderCell[] = ddcForRunFolder.flatMap(
  (ddcId, ddcIdx) =>
    hours.map((hour) => {
      const base = 0.92 - ddcIdx * 0.02 - hour * 0.003;
      const noise = ((hour * 13 + ddcIdx * 7) % 10) / 100;
      const completeness = Math.max(0, Math.min(1, base + noise));
      const gap =
        (ddcId === "DDC-10" && hour >= 7 && hour <= 9) ||
        (ddcId === "DDC-07" && hour >= 2 && hour <= 3);
      return {
        ddcId,
        hour,
        completeness: gap ? 0.3 : completeness,
      };
    })
);

export const dataQualityCells: DataQualityCell[] = [
  { ddcId: "DDC-01", date: "2026-03-24", status: "ok" },
  { ddcId: "DDC-01", date: "2026-03-25", status: "ok" },
  { ddcId: "DDC-01", date: "2026-03-26", status: "ok" },
  { ddcId: "DDC-01", date: "2026-03-27", status: "ok" },
  { ddcId: "DDC-02", date: "2026-03-24", status: "ok" },
  { ddcId: "DDC-02", date: "2026-03-25", status: "outlier", flaggedPoints: ["TS-01-OA"] },
  { ddcId: "DDC-02", date: "2026-03-26", status: "ok" },
  { ddcId: "DDC-02", date: "2026-03-27", status: "ok" },
  { ddcId: "DDC-03", date: "2026-03-24", status: "missing" },
  { ddcId: "DDC-03", date: "2026-03-25", status: "ok" },
  { ddcId: "DDC-03", date: "2026-03-26", status: "ok" },
  { ddcId: "DDC-03", date: "2026-03-27", status: "ok" },
  { ddcId: "DDC-04", date: "2026-03-24", status: "stuck" },
  { ddcId: "DDC-04", date: "2026-03-25", status: "ok" },
  { ddcId: "DDC-04", date: "2026-03-26", status: "ok" },
  { ddcId: "DDC-04", date: "2026-03-27", status: "ok" },
  { ddcId: "DDC-05", date: "2026-03-24", status: "ok" },
  { ddcId: "DDC-05", date: "2026-03-25", status: "ok" },
  { ddcId: "DDC-05", date: "2026-03-26", status: "ok" },
  { ddcId: "DDC-05", date: "2026-03-27", status: "ok" },
  { ddcId: "DDC-07", date: "2026-03-24", status: "outlier", flaggedPoints: ["VAV-7-01", "VAV-7-05"] },
  { ddcId: "DDC-07", date: "2026-03-25", status: "outlier", flaggedPoints: ["VAV-7-01"] },
  { ddcId: "DDC-07", date: "2026-03-26", status: "missing" },
  { ddcId: "DDC-07", date: "2026-03-27", status: "ok" },
  { ddcId: "DDC-10", date: "2026-03-24", status: "missing" },
  { ddcId: "DDC-10", date: "2026-03-25", status: "missing" },
  { ddcId: "DDC-10", date: "2026-03-26", status: "missing" },
  { ddcId: "DDC-10", date: "2026-03-27", status: "missing" },
];

export const sensorCrossChecks: SensorCrossCheck[] = [
  {
    pair: "SAT vs Return Temp (AHU-01)",
    expectedCorrelation: "High (0.82)",
    divergence: "Dropped to 0.12",
    duration: "48h",
    affectedStrategies: "Opp. 10, Opp. 1",
    note: "SAT sensor likely stuck at 14.2°C",
  },
  {
    pair: "Supply DP vs Fan Speed (AHU-02)",
    expectedCorrelation: "Medium (0.55)",
    divergence: "-0.08",
    duration: "6h",
    affectedStrategies: "Opp. 5",
  },
  {
    pair: "CW Temp vs Tower Fan kW (CT-02)",
    expectedCorrelation: "High (0.76)",
    divergence: "0.31",
    duration: "12h",
    affectedStrategies: "Opp. 8",
  },
];

export const infraHealthTrend: InfraHealthPoint[] = [
  { time: "T-24h", usedTb: 2.9, capacityTb: 5 },
  { time: "T-18h", usedTb: 3.0, capacityTb: 5 },
  { time: "T-12h", usedTb: 3.05, capacityTb: 5 },
  { time: "T-6h", usedTb: 3.12, capacityTb: 5 },
  { time: "Now", usedTb: 3.15, capacityTb: 5 },
];

export const serviceHealth: ServiceHealth[] = [
  {
    name: "Ingestion Workers",
    uptimePct: 99.99,
    lastRestart: "2026-03-24T02:30:00Z",
    errorCount24h: 2,
    status: "ok",
  },
  {
    name: "Curator",
    uptimePct: 99.8,
    lastRestart: "2026-03-26T12:10:00Z",
    errorCount24h: 11,
    coldStarts7d: 1,
    status: "warn",
  },
  {
    name: "API Gateway",
    uptimePct: 99.95,
    lastRestart: "2026-03-22T06:00:00Z",
    errorCount24h: 0,
    status: "ok",
  },
  {
    name: "DDC Collector",
    uptimePct: 97.2,
    lastRestart: "2026-03-27T09:55:00Z",
    errorCount24h: 42,
    coldStarts7d: 5,
    status: "down",
  },
];

// ---------------------------------------------------------------------------
// 3. DDC Deep Dive Data (Sample for DDC-01)
// ---------------------------------------------------------------------------

export const ddcPoints: DDCPoint[] = [
  { name: "CH-01-Status", currentValue: true, trend1h: "stable", unit: "On/Off", pointClass: "BI", qualityFlag: "ok" },
  { name: "CH-01-Load", currentValue: 68.5, trend1h: "up", unit: "%", pointClass: "AI", qualityFlag: "ok" },
  { name: "CHWS-Temp", currentValue: 6.8, trend1h: "stable", unit: "°C", pointClass: "AI", qualityFlag: "ok" },
  { name: "CHWR-Temp", currentValue: 12.4, trend1h: "up", unit: "°C", pointClass: "AI", qualityFlag: "ok" },
  { name: "CHW-Flow", currentValue: 42.5, trend1h: "up", unit: "L/s", pointClass: "AI", qualityFlag: "ok" },
  { name: "CHW-Pump-Speed", currentValue: 82, trend1h: "up", unit: "%", pointClass: "AO", qualityFlag: "ok" },
  { name: "CHW-DP", currentValue: 145, trend1h: "stable", unit: "kPa", pointClass: "AI", qualityFlag: "ok" },
  { name: "CHW-DP-SP", currentValue: 150, trend1h: "stable", unit: "kPa", pointClass: "AV", qualityFlag: "ok" },
  { name: "CH-01-Fault", currentValue: false, trend1h: "stable", unit: "Alarm", pointClass: "BI", qualityFlag: "ok" },
];

export const pointStats: PointStats[] = [
  { name: "CH-01-Load", min: 0, mean: 45.2, max: 92.1, stdDev: 15.4, last: 68.5 },
  { name: "CHWS-Temp", min: 6.2, mean: 6.9, max: 7.5, stdDev: 0.2, last: 6.8 },
  { name: "CHWR-Temp", min: 10.1, mean: 12.8, max: 15.4, stdDev: 1.1, last: 12.4 },
  { name: "CHW-Flow", min: 0, mean: 32.4, max: 58.2, stdDev: 8.5, last: 42.5 },
];

export const binaryTimeline: BinaryTimeline[] = [
  {
    point: "CH-01-Status",
    segments: [
      { start: "2026-03-26T00:00:00Z", end: "2026-03-26T06:00:00Z", state: "off" },
      { start: "2026-03-26T06:00:00Z", end: "2026-03-26T18:00:00Z", state: "on" },
      { start: "2026-03-26T18:00:00Z", end: "2026-03-27T00:00:00Z", state: "off" },
    ],
  },
  {
    point: "CH-01-Fault",
    segments: [
      { start: "2026-03-26T00:00:00Z", end: "2026-03-26T12:00:00Z", state: "off" },
      { start: "2026-03-26T12:00:00Z", end: "2026-03-26T14:00:00Z", state: "fault" },
      { start: "2026-03-26T14:00:00Z", end: "2026-03-27T00:00:00Z", state: "off" },
    ],
  },
  {
    point: "CHW-Pump-1",
    segments: [
      { start: "2026-03-26T00:00:00Z", end: "2026-03-26T05:00:00Z", state: "off" },
      { start: "2026-03-26T05:00:00Z", end: "2026-03-26T16:00:00Z", state: "on" },
      { start: "2026-03-26T16:00:00Z", end: "2026-03-27T00:00:00Z", state: "off" },
    ],
  },
];

export const boxPlotSeries: BoxPlotSeries[] = [
  { point: "CH-01-Load", stats: [5, 28, 45, 68, 92] },
  { point: "CHWS-Temp", stats: [6.2, 6.6, 6.9, 7.2, 7.5] },
  { point: "CHWR-Temp", stats: [10.1, 11.4, 12.8, 13.6, 15.4] },
  { point: "CHW-Flow", stats: [0, 18, 32, 46, 58] },
];

export const qualityFlagTimeline: QualityFlagSegment[] = [
  {
    point: "CH-01-Load",
    segments: [
      { start: "2026-03-26T00:00:00Z", end: "2026-03-26T20:00:00Z", status: "ok" },
      { start: "2026-03-26T20:00:00Z", end: "2026-03-27T02:00:00Z", status: "suspect" },
      { start: "2026-03-27T02:00:00Z", end: "2026-03-27T12:00:00Z", status: "ok" },
    ],
  },
  {
    point: "CHWS-Temp",
    segments: [
      { start: "2026-03-26T00:00:00Z", end: "2026-03-26T23:59:59Z", status: "ok" },
    ],
  },
  {
    point: "CHW-Flow",
    segments: [
      { start: "2026-03-26T00:00:00Z", end: "2026-03-26T06:00:00Z", status: "missing" },
      { start: "2026-03-26T06:00:00Z", end: "2026-03-27T12:00:00Z", status: "ok" },
    ],
  },
];

export const rawDataRows: RawDataRow[] = [
  { timestamp: "2026-03-27T10:30:00Z", point: "CH-01-Load", value: 68.5, unit: "%", qualityFlag: "ok" },
  { timestamp: "2026-03-27T10:30:00Z", point: "CHWS-Temp", value: 6.8, unit: "°C", qualityFlag: "ok" },
  { timestamp: "2026-03-27T10:30:00Z", point: "CHWR-Temp", value: 12.4, unit: "°C", qualityFlag: "ok" },
  { timestamp: "2026-03-27T10:30:00Z", point: "CHW-Flow", value: 42.5, unit: "L/s", qualityFlag: "ok" },
  { timestamp: "2026-03-27T10:30:00Z", point: "CHW-Pump-Speed", value: 82, unit: "%", qualityFlag: "ok" },
];
