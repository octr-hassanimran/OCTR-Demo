// ── Water Side SCADA Components ──────────────────────────────

export type WaterSideComponent = {
  id: string;
  label: string;
  type: "chiller" | "pump" | "tower" | "ahu";
  subType?: "primary" | "secondary" | "condenser";
  status: "running" | "standby" | "fault";
  sensors: { label: string; value: number; unit: string }[];
};

export const waterSideComponents: WaterSideComponent[] = [
  {
    id: "CH-1",
    label: "Chiller 1",
    type: "chiller",
    status: "running",
    sensors: [
      { label: "Load", value: 38, unit: "%" },
      { label: "COP", value: 4.2, unit: "" },
    ],
  },
  {
    id: "CH-2",
    label: "Chiller 2",
    type: "chiller",
    status: "running",
    sensors: [
      { label: "Load", value: 35, unit: "%" },
      { label: "COP", value: 3.8, unit: "" },
    ],
  },
  {
    id: "CH-3",
    label: "Chiller 3",
    type: "chiller",
    status: "standby",
    sensors: [],
  },
  {
    id: "PP-1",
    label: "Pri Pump 1",
    type: "pump",
    subType: "primary",
    status: "running",
    sensors: [{ label: "Speed", value: 72, unit: "%" }],
  },
  {
    id: "PP-2",
    label: "Pri Pump 2",
    type: "pump",
    subType: "primary",
    status: "running",
    sensors: [{ label: "Speed", value: 68, unit: "%" }],
  },
  {
    id: "SP-1",
    label: "Sec Pump 1",
    type: "pump",
    subType: "secondary",
    status: "running",
    sensors: [
      { label: "Speed", value: 65, unit: "%" },
      { label: "ΔP", value: 85, unit: "kPa" },
    ],
  },
  {
    id: "SP-2",
    label: "Sec Pump 2",
    type: "pump",
    subType: "secondary",
    status: "standby",
    sensors: [],
  },
  {
    id: "CP-1",
    label: "Cond Pump 1",
    type: "pump",
    subType: "condenser",
    status: "running",
    sensors: [{ label: "Speed", value: 80, unit: "%" }],
  },
  {
    id: "CP-2",
    label: "Cond Pump 2",
    type: "pump",
    subType: "condenser",
    status: "running",
    sensors: [{ label: "Speed", value: 78, unit: "%" }],
  },
  {
    id: "CT-1",
    label: "Tower 1",
    type: "tower",
    status: "running",
    sensors: [
      { label: "Fan", value: 85, unit: "%" },
      { label: "CW Out", value: 29.5, unit: "°C" },
    ],
  },
  {
    id: "CT-2",
    label: "Tower 2",
    type: "tower",
    status: "running",
    sensors: [
      { label: "Fan", value: 82, unit: "%" },
      { label: "CW Out", value: 29.8, unit: "°C" },
    ],
  },
  {
    id: "AHU-1",
    label: "AHU-1",
    type: "ahu",
    status: "running",
    sensors: [
      { label: "SAT", value: 14.2, unit: "°C" },
      { label: "Vlv", value: 72, unit: "%" },
    ],
  },
  {
    id: "AHU-2",
    label: "AHU-2",
    type: "ahu",
    status: "running",
    sensors: [
      { label: "SAT", value: 13.8, unit: "°C" },
      { label: "Vlv", value: 68, unit: "%" },
    ],
  },
  {
    id: "AHU-3",
    label: "AHU-3",
    type: "ahu",
    status: "fault",
    sensors: [
      { label: "SAT", value: 16.5, unit: "°C" },
      { label: "Vlv", value: 85, unit: "%" },
    ],
  },
];

// ── Water Side Pipes ─────────────────────────────────────────

export type WaterSidePipe = {
  from: string;
  to: string;
  tempC: number;
  flowLps?: number;
  type: "supply" | "return" | "condenser";
};

export const waterSidePipes: WaterSidePipe[] = [
  { from: "chillers", to: "primary-pumps", tempC: 6.5, flowLps: 42, type: "supply" },
  { from: "primary-pumps", to: "secondary-pumps", tempC: 6.7, type: "supply" },
  { from: "secondary-pumps", to: "ahus", tempC: 6.8, flowLps: 38, type: "supply" },
  { from: "ahus", to: "chillers", tempC: 12.2, flowLps: 38, type: "return" },
  { from: "chillers", to: "condenser-pumps", tempC: 35.2, type: "condenser" },
  { from: "condenser-pumps", to: "cooling-towers", tempC: 35.0, type: "condenser" },
  { from: "cooling-towers", to: "chillers", tempC: 29.5, type: "condenser" },
];

// ── KPI Gauges ───────────────────────────────────────────────

export type WaterSideGauge = {
  label: string;
  current: number;
  target: number;
  redThreshold: number;
  min: number;
  max: number;
  unit: string;
  oehOpp: number;
  sparkline: number[];
  invertRed?: boolean;
};

export const waterSideGauges: WaterSideGauge[] = [
  {
    label: "Evaporator ΔT",
    current: 5.7,
    target: 5.0,
    redThreshold: 3.0,
    min: 0,
    max: 10,
    unit: "°C",
    oehOpp: 7,
    sparkline: [5.2, 5.4, 5.6, 5.8, 5.7, 5.5, 5.3, 5.4, 5.7, 5.8, 5.7, 5.6],
    invertRed: true,
  },
  {
    label: "Condenser Approach",
    current: 3.2,
    target: 2.5,
    redThreshold: 4.0,
    min: 0,
    max: 8,
    unit: "°C",
    oehOpp: 8,
    sparkline: [2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.2, 3.1, 3.0, 3.2, 3.3, 3.2],
  },
  {
    label: "CHW Supply vs Reset",
    current: 7.2,
    target: 6.5,
    redThreshold: 8.5,
    min: 4,
    max: 12,
    unit: "°C",
    oehOpp: 7,
    sparkline: [6.8, 6.9, 7.0, 7.1, 7.2, 7.2, 7.1, 7.0, 7.2, 7.3, 7.2, 7.1],
  },
  {
    label: "Pump ΔP",
    current: 85,
    target: 75,
    redThreshold: 110,
    min: 0,
    max: 150,
    unit: "kPa",
    oehOpp: 14,
    sparkline: [82, 83, 84, 86, 88, 87, 85, 84, 85, 86, 85, 84],
  },
];

// ── Chiller Staging ──────────────────────────────────────────

export type ChillerUnit = {
  id: string;
  loadPct: number;
  copKwPerKw: number;
  running: boolean;
};

export const chillerData: ChillerUnit[] = [
  { id: "CH-1", loadPct: 38, copKwPerKw: 4.2, running: true },
  { id: "CH-2", loadPct: 35, copKwPerKw: 3.8, running: true },
  { id: "CH-3", loadPct: 0, copKwPerKw: 0, running: false },
];

export type CopPoint = { t: string; cop: number };

export const copTrend: CopPoint[] = [
  { t: "00:00", cop: 5.1 },
  { t: "01:00", cop: 5.0 },
  { t: "02:00", cop: 4.9 },
  { t: "03:00", cop: 4.8 },
  { t: "04:00", cop: 4.7 },
  { t: "05:00", cop: 4.6 },
  { t: "06:00", cop: 4.5 },
  { t: "07:00", cop: 4.4 },
  { t: "08:00", cop: 4.3 },
  { t: "09:00", cop: 4.2 },
  { t: "10:00", cop: 4.1 },
  { t: "11:00", cop: 4.0 },
  { t: "12:00", cop: 3.9 },
];

// ── VSD & Free Cooling ──────────────────────────────────────

export type VsdPoint = { loadPct: number; speedPct: number; label: string };

export const vsdData: VsdPoint[] = [
  { loadPct: 20, speedPct: 62, label: "SP-1" },
  { loadPct: 35, speedPct: 65, label: "PP-1" },
  { loadPct: 45, speedPct: 68, label: "CP-1" },
  { loadPct: 50, speedPct: 70, label: "SP-2" },
  { loadPct: 60, speedPct: 72, label: "PP-2" },
  { loadPct: 72, speedPct: 75, label: "CP-2" },
  { loadPct: 30, speedPct: 78, label: "PP-3" },
  { loadPct: 85, speedPct: 82, label: "CP-3" },
  { loadPct: 42, speedPct: 80, label: "SP-3" },
  { loadPct: 90, speedPct: 88, label: "PP-4" },
];

export type PumpRuntime = {
  id: string;
  label: string;
  hours: number;
  maxHours: number;
};

export const pumpRuntimes: PumpRuntime[] = [
  { id: "PP-1", label: "Pri Pump 1", hours: 6840, maxHours: 8000 },
  { id: "PP-2", label: "Pri Pump 2", hours: 7200, maxHours: 8000 },
  { id: "SP-1", label: "Sec Pump 1", hours: 5400, maxHours: 8000 },
  { id: "SP-2", label: "Sec Pump 2", hours: 2100, maxHours: 8000 },
  { id: "CP-1", label: "Cond Pump 1", hours: 7800, maxHours: 8000 },
  { id: "CP-2", label: "Cond Pump 2", hours: 7600, maxHours: 8000 },
];

export type FreeCoolingMonth = {
  month: string;
  availableHrs: number;
  usedHrs: number;
};

export const freeCoolingData: FreeCoolingMonth[] = [
  { month: "Apr", availableHrs: 120, usedHrs: 45 },
  { month: "May", availableHrs: 80, usedHrs: 30 },
  { month: "Jun", availableHrs: 20, usedHrs: 8 },
  { month: "Jul", availableHrs: 5, usedHrs: 0 },
  { month: "Aug", availableHrs: 8, usedHrs: 2 },
  { month: "Sep", availableHrs: 40, usedHrs: 15 },
  { month: "Oct", availableHrs: 95, usedHrs: 40 },
  { month: "Nov", availableHrs: 180, usedHrs: 82 },
  { month: "Dec", availableHrs: 260, usedHrs: 140 },
  { month: "Jan", availableHrs: 310, usedHrs: 185 },
  { month: "Feb", availableHrs: 280, usedHrs: 160 },
  { month: "Mar", availableHrs: 220, usedHrs: 110 },
];

// ══════════════════════════════════════════════════════════════
// AIR SIDE DATA
// ══════════════════════════════════════════════════════════════

export type AHUOption = { id: string; label: string };

export const ahuOptions: AHUOption[] = [
  { id: "ahu-01", label: "AHU-01" },
  { id: "ahu-02", label: "AHU-02" },
  { id: "ahu-03", label: "AHU-03" },
  { id: "fleet", label: "Fleet View" },
];

export type TimelineEntry = { hour: number; states: string[] };

export const ahuTimeline: TimelineEntry[] = [
  { hour: 0, states: ["Fan Run"] },
  { hour: 1, states: ["Fan Run"] },
  { hour: 2, states: ["Fan Run"] },
  { hour: 3, states: ["Fan Run"] },
  { hour: 4, states: ["Fan Run"] },
  { hour: 5, states: ["Fan Run", "Night Purge"] },
  { hour: 6, states: ["Fan Run", "Heating"] },
  { hour: 7, states: ["Fan Run", "Occupied", "Heating"] },
  { hour: 8, states: ["Fan Run", "Occupied", "Heating", "Cooling"] },
  { hour: 9, states: ["Fan Run", "Occupied", "Cooling"] },
  { hour: 10, states: ["Fan Run", "Occupied", "Heating", "Cooling"] },
  { hour: 11, states: ["Fan Run", "Occupied", "Heating", "Cooling"] },
  { hour: 12, states: ["Fan Run", "Occupied", "Cooling"] },
  { hour: 13, states: ["Fan Run", "Occupied", "Cooling"] },
  { hour: 14, states: ["Fan Run", "Occupied", "Cooling", "Economy"] },
  { hour: 15, states: ["Fan Run", "Occupied", "Cooling"] },
  { hour: 16, states: ["Fan Run", "Occupied", "Cooling"] },
  { hour: 17, states: ["Fan Run", "Occupied", "Cooling"] },
  { hour: 18, states: ["Fan Run", "Cooling"] },
  { hour: 19, states: ["Fan Run", "Cooling"] },
  { hour: 20, states: ["Fan Run"] },
  { hour: 21, states: ["Fan Run"] },
  { hour: 22, states: ["Fan Run"] },
  { hour: 23, states: ["Fan Run"] },
];

export type TemperaturePoint = {
  time: string;
  satActual: number;
  satSetpoint: number;
  rat: number;
  oat: number;
};

export const temperatureData: TemperaturePoint[] = Array.from(
  { length: 48 },
  (_, i) => {
    const hr = i / 2;
    const time = `${String(Math.floor(hr)).padStart(2, "0")}:${i % 2 === 0 ? "00" : "30"}`;
    const oatBase = 20 + 8 * Math.sin(((hr - 6) / 24) * Math.PI * 2);
    return {
      time,
      satActual: 12.8 + Math.sin(hr / 3) * 0.6 + Math.random() * 0.3,
      satSetpoint: 13.0,
      rat: 22.5 + Math.sin(hr / 4) * 1.2 + Math.random() * 0.4,
      oat: Math.round((oatBase + Math.random() * 1.5) * 10) / 10,
    };
  },
);

export type DSPRPoint = { time: string; actual: number; optimal: number };

export const dsprData: DSPRPoint[] = Array.from({ length: 24 }, (_, i) => {
  const time = `${String(i).padStart(2, "0")}:00`;
  const loadFactor = i >= 8 && i <= 17 ? 0.7 + Math.random() * 0.3 : 0.2 + Math.random() * 0.2;
  return {
    time,
    actual: 350,
    optimal: Math.round(180 + loadFactor * 120),
  };
});

export type VAVPosition = { id: string; position: number };

export const vavPositions: VAVPosition[] = [
  { id: "VAV-01", position: 28 },
  { id: "VAV-02", position: 35 },
  { id: "VAV-03", position: 42 },
  { id: "VAV-04", position: 31 },
  { id: "VAV-05", position: 38 },
  { id: "VAV-06", position: 22 },
  { id: "VAV-07", position: 45 },
  { id: "VAV-08", position: 33 },
  { id: "VAV-09", position: 48 },
  { id: "VAV-10", position: 55 },
  { id: "VAV-11", position: 29 },
  { id: "VAV-12", position: 62 },
  { id: "VAV-13", position: 37 },
  { id: "VAV-14", position: 41 },
  { id: "VAV-15", position: 78 },
];

export type EconomyCyclePoint = {
  time: string;
  oaEnthalpy: number;
  raEnthalpy: number;
  threshold: number;
};

export const economyCycleData: EconomyCyclePoint[] = Array.from(
  { length: 24 },
  (_, i) => {
    const oaBase = 38 + 18 * Math.sin(((i - 6) / 24) * Math.PI * 2);
    return {
      time: `${String(i).padStart(2, "0")}:00`,
      oaEnthalpy: Math.round((oaBase + Math.random() * 3) * 10) / 10,
      raEnthalpy: 48 + Math.random() * 2,
      threshold: 52,
    };
  },
);

export type EconomyHoursDay = {
  day: string;
  active: number;
  available: number;
};

export const economyHoursData: EconomyHoursDay[] = [
  { day: "Mon", active: 2, available: 7 },
  { day: "Tue", active: 3, available: 8 },
  { day: "Wed", active: 1, available: 6 },
  { day: "Thu", active: 4, available: 9 },
  { day: "Fri", active: 2, available: 7 },
  { day: "Sat", active: 0, available: 10 },
  { day: "Sun", active: 0, available: 11 },
];

export const nightPurgeData = {
  spaceTemp: 26.2,
  oaTemp: 19.0,
  conditionsMet: true,
  activated: false,
  comparison: {
    withPurge: { preOccupancyTemp: 22.0, startupEnergy: 85 },
    withoutPurge: { preOccupancyTemp: 26.0, startupEnergy: 145 },
  },
};

export type HWResetPoint = { month: string; actual: number; optimal: number };

export const hwResetData: HWResetPoint[] = [
  { month: "Apr", actual: 80, optimal: 65 },
  { month: "May", actual: 80, optimal: 60 },
  { month: "Jun", actual: 80, optimal: 55 },
  { month: "Jul", actual: 80, optimal: 55 },
  { month: "Aug", actual: 80, optimal: 55 },
  { month: "Sep", actual: 80, optimal: 60 },
  { month: "Oct", actual: 80, optimal: 65 },
  { month: "Nov", actual: 80, optimal: 72 },
  { month: "Dec", actual: 80, optimal: 78 },
  { month: "Jan", actual: 80, optimal: 80 },
  { month: "Feb", actual: 80, optimal: 78 },
  { month: "Mar", actual: 80, optimal: 72 },
];

// ══════════════════════════════════════════════════════════════
// ZONES DATA
// ══════════════════════════════════════════════════════════════

export type ZoneDataItem = {
  id: string;
  name: string;
  floor: number;
  x: number;
  y: number;
  w: number;
  h: number;
  currentTemp: number;
  setpoint: number;
  deviation: number;
  co2Ppm: number;
  occupancy: number;
  deadBandC: number;
  crossingsPerHour: number;
};

export const zoneData: ZoneDataItem[] = [
  { id: "Z-01", name: "Reception", floor: 1, x: 20, y: 350, w: 170, h: 60, currentTemp: 23.5, setpoint: 23, deviation: 0.5, co2Ppm: 720, occupancy: 0.6, deadBandC: 2.5, crossingsPerHour: 1.2 },
  { id: "Z-02", name: "Open Office North", floor: 1, x: 210, y: 350, w: 170, h: 60, currentTemp: 26.2, setpoint: 24, deviation: 2.2, co2Ppm: 880, occupancy: 0.85, deadBandC: 1.0, crossingsPerHour: 5.4 },
  { id: "Z-03", name: "Open Office South", floor: 1, x: 400, y: 350, w: 170, h: 60, currentTemp: 24.8, setpoint: 24, deviation: 0.8, co2Ppm: 850, occupancy: 0.8, deadBandC: 2.0, crossingsPerHour: 2.1 },
  { id: "Z-04", name: "Conference A", floor: 1, x: 590, y: 350, w: 170, h: 60, currentTemp: 22.5, setpoint: 23, deviation: -0.5, co2Ppm: 580, occupancy: 0.3, deadBandC: 3.0, crossingsPerHour: 0.8 },
  { id: "Z-05", name: "Executive Suite", floor: 2, x: 20, y: 200, w: 170, h: 60, currentTemp: 23.0, setpoint: 23, deviation: 0.0, co2Ppm: 650, occupancy: 0.4, deadBandC: 2.5, crossingsPerHour: 0.5 },
  { id: "Z-06", name: "Server Room", floor: 2, x: 210, y: 200, w: 170, h: 60, currentTemp: 21.0, setpoint: 22, deviation: -1.0, co2Ppm: 420, occupancy: 0.05, deadBandC: 1.0, crossingsPerHour: 4.8 },
  { id: "Z-07", name: "Café", floor: 2, x: 400, y: 200, w: 170, h: 60, currentTemp: 25.5, setpoint: 24, deviation: 1.5, co2Ppm: 920, occupancy: 0.7, deadBandC: 2.0, crossingsPerHour: 1.8 },
  { id: "Z-08", name: "Open Office East", floor: 2, x: 590, y: 200, w: 170, h: 60, currentTemp: 25.8, setpoint: 24, deviation: 1.8, co2Ppm: 870, occupancy: 0.9, deadBandC: 1.5, crossingsPerHour: 3.6 },
  { id: "Z-09", name: "Open Office West", floor: 3, x: 20, y: 50, w: 170, h: 60, currentTemp: 21.5, setpoint: 24, deviation: -2.5, co2Ppm: 560, occupancy: 0.5, deadBandC: 1.0, crossingsPerHour: 6.2 },
  { id: "Z-10", name: "Conference B", floor: 3, x: 210, y: 50, w: 170, h: 60, currentTemp: 24.2, setpoint: 24, deviation: 0.2, co2Ppm: 780, occupancy: 0.6, deadBandC: 2.5, crossingsPerHour: 1.0 },
  { id: "Z-11", name: "Corner Office", floor: 3, x: 400, y: 50, w: 170, h: 60, currentTemp: 27.1, setpoint: 24, deviation: 3.1, co2Ppm: 690, occupancy: 0.3, deadBandC: 1.5, crossingsPerHour: 4.2 },
  { id: "Z-12", name: "Lobby", floor: 3, x: 590, y: 50, w: 170, h: 60, currentTemp: 23.8, setpoint: 23, deviation: 0.8, co2Ppm: 550, occupancy: 0.4, deadBandC: 3.0, crossingsPerHour: 0.6 },
];

export type ComfortHeatmapCell = {
  zone: string;
  hour: number;
  deviation: number;
};

function generateComfortHeatmap(): ComfortHeatmapCell[] {
  const data: ComfortHeatmapCell[] = [];
  for (const zone of zoneData) {
    for (let h = 0; h < 24; h++) {
      let dev = zone.deviation;
      if (h >= 12 && h <= 15) dev += 0.8;
      if (h >= 0 && h <= 5) dev *= 0.4;
      if (zone.name === "Café" && h >= 11 && h <= 13) dev += 1.2;
      if (zone.name === "Corner Office" && h >= 14 && h <= 17) dev += 1.0;
      if (zone.name === "Open Office West" && h >= 9 && h <= 17) dev -= 0.5;
      data.push({
        zone: zone.name,
        hour: h,
        deviation: Math.round((dev + (Math.random() - 0.5) * 0.6) * 10) / 10,
      });
    }
  }
  return data;
}

export const comfortHeatmapData = generateComfortHeatmap();

// ══════════════════════════════════════════════════════════════
// EQUIPMENT HEALTH DATA
// ══════════════════════════════════════════════════════════════

export type EquipmentItem = {
  id: string;
  name: string;
  type: string;
  runtimeHours: number;
  recommendedInterval: number;
  startStopCycles: number;
  efficiencyPct: number;
  healthScore: number;
  status: "on_track" | "due_soon" | "overdue";
  sparkline: number[];
};

export const equipmentData: EquipmentItem[] = [
  {
    id: "EQ-01", name: "Chiller 1", type: "chiller",
    runtimeHours: 7200, recommendedInterval: 10000, startStopCycles: 340,
    efficiencyPct: 92, healthScore: 92, status: "on_track",
    sparkline: [94, 93, 93, 92, 93, 92, 91, 92, 92, 93, 92, 92],
  },
  {
    id: "EQ-02", name: "Chiller 2", type: "chiller",
    runtimeHours: 8800, recommendedInterval: 10000, startStopCycles: 580,
    efficiencyPct: 78, healthScore: 78, status: "due_soon",
    sparkline: [85, 84, 83, 82, 81, 80, 80, 79, 79, 78, 78, 78],
  },
  {
    id: "EQ-03", name: "AHU-01", type: "ahu",
    runtimeHours: 6500, recommendedInterval: 8000, startStopCycles: 210,
    efficiencyPct: 87, healthScore: 87, status: "on_track",
    sparkline: [89, 89, 88, 88, 87, 87, 87, 88, 87, 87, 87, 87],
  },
  {
    id: "EQ-04", name: "AHU-02", type: "ahu",
    runtimeHours: 11200, recommendedInterval: 10000, startStopCycles: 620,
    efficiencyPct: 65, healthScore: 65, status: "overdue",
    sparkline: [78, 76, 74, 73, 72, 70, 69, 68, 67, 66, 65, 65],
  },
  {
    id: "EQ-05", name: "AHU-03", type: "ahu",
    runtimeHours: 5800, recommendedInterval: 8000, startStopCycles: 185,
    efficiencyPct: 95, healthScore: 95, status: "on_track",
    sparkline: [95, 95, 95, 96, 95, 95, 95, 95, 95, 95, 96, 95],
  },
  {
    id: "EQ-06", name: "Primary Pump 1", type: "pump",
    runtimeHours: 6840, recommendedInterval: 8000, startStopCycles: 420,
    efficiencyPct: 88, healthScore: 88, status: "on_track",
    sparkline: [90, 90, 89, 89, 89, 88, 88, 88, 88, 88, 88, 88],
  },
  {
    id: "EQ-07", name: "Secondary Pump 1", type: "pump",
    runtimeHours: 7500, recommendedInterval: 8000, startStopCycles: 510,
    efficiencyPct: 71, healthScore: 71, status: "due_soon",
    sparkline: [80, 78, 77, 76, 75, 74, 73, 73, 72, 71, 71, 71],
  },
  {
    id: "EQ-08", name: "Cooling Tower 1", type: "tower",
    runtimeHours: 6200, recommendedInterval: 8000, startStopCycles: 180,
    efficiencyPct: 83, healthScore: 83, status: "on_track",
    sparkline: [87, 86, 86, 85, 85, 84, 84, 84, 83, 83, 83, 83],
  },
];

export type EEVTXVItem = {
  id: string;
  circuit: string;
  type: "EEV" | "TXV";
  superheatC: number;
  targetMin: number;
  targetMax: number;
};

export const eevTxvData: EEVTXVItem[] = [
  { id: "C-1", circuit: "Chiller 1 - Circuit A", type: "EEV", superheatC: 2.5, targetMin: 2, targetMax: 3 },
  { id: "C-2", circuit: "Chiller 1 - Circuit B", type: "EEV", superheatC: 2.8, targetMin: 2, targetMax: 3 },
  { id: "C-3", circuit: "Chiller 2 - Circuit A", type: "TXV", superheatC: 5.8, targetMin: 5, targetMax: 7 },
  { id: "C-4", circuit: "Chiller 2 - Circuit B", type: "TXV", superheatC: 6.2, targetMin: 5, targetMax: 7 },
];

export type DegradationPoint = {
  month: string;
  coolingTowerApproach: number;
  chillerCOP: number;
  filterDP: number;
};

export const degradationTrends: DegradationPoint[] = [
  { month: "Oct", coolingTowerApproach: 2.1, chillerCOP: 5.2, filterDP: 120 },
  { month: "Nov", coolingTowerApproach: 2.3, chillerCOP: 5.0, filterDP: 145 },
  { month: "Dec", coolingTowerApproach: 2.5, chillerCOP: 4.8, filterDP: 168 },
  { month: "Jan", coolingTowerApproach: 2.8, chillerCOP: 4.6, filterDP: 195 },
  { month: "Feb", coolingTowerApproach: 3.0, chillerCOP: 4.4, filterDP: 220 },
  { month: "Mar", coolingTowerApproach: 3.2, chillerCOP: 4.2, filterDP: 255 },
];

export type BMSChange = {
  timestamp: string;
  user: string;
  change: string;
  category: string;
};

export const bmsChanges: BMSChange[] = [
  { timestamp: "2026-03-25 14:32", user: "J. Kim", change: "Disabled Economy Cycle on AHU-01", category: "Strategy Disabled" },
  { timestamp: "2026-03-24 09:15", user: "S. Park", change: "CHW setpoint override to 6°C (was 7°C reset)", category: "Setpoint Override" },
  { timestamp: "2026-03-22 16:48", user: "J. Kim", change: "Disabled Night Purge schedule", category: "Strategy Disabled" },
  { timestamp: "2026-03-20 11:00", user: "System", change: "OSS learning algorithm updated coefficients", category: "Auto-Update" },
  { timestamp: "2026-03-18 08:30", user: "H. Lee", change: "Increased dead band to 2.5°C on Floor 2", category: "Setpoint Change" },
];
