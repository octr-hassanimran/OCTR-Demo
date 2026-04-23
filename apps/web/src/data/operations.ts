// =============================================================================
// DB-2 Live Operations — Synthetic Data
// =============================================================================

export type DDCStatus = {
  id: string;
  name: string;
  lastSeen: string;
  status: "live" | "stale" | "offline";
  pointCount: number;
  activeAlarms: number;
};

export type PrioritizedFault = {
  id: string;
  severity: "high" | "med" | "low";
  faultType: string;
  equipment: string;
  floor?: number;
  durationDays: number;
  durationLabel: string;
  estKwhPerDay: number;
  oehOpp: number;
  oehName: string;
  status: "open" | "ack" | "in_progress";
  description: string;
  recommendedAction: string;
  affectedEquipmentDetails: string;
  energyImpactCalc: string;
  relatedDb3Tab?: "water" | "air" | "zones" | "equipment";
};

export type DemandCurvePoint = {
  time: string;
  todayKw: number;
  yesterdayKw: number;
  avg7dKw: number;
};

export type DemandMeta = {
  peakTariffWindows: { start: string; end: string }[];
  ossStartWindow: { start: string; end: string };
  monthPeakKw: number;
  contractLimitKw: number;
};

export type AlertHeatmapCell = [number, number, number];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60000).toISOString();
}

// ---------------------------------------------------------------------------
// 1. DDC Controller Statuses
// ---------------------------------------------------------------------------

export const ddcStatuses: DDCStatus[] = [
  { id: "DDC-01", name: "Chiller Plant",    lastSeen: minutesAgo(2),  status: "live",    pointCount: 342, activeAlarms: 0 },
  { id: "DDC-02", name: "AHU-01 Lobby",     lastSeen: minutesAgo(1),  status: "live",    pointCount: 186, activeAlarms: 2 },
  { id: "DDC-03", name: "AHU-02 Flrs 1-3",  lastSeen: minutesAgo(3),  status: "live",    pointCount: 178, activeAlarms: 1 },
  { id: "DDC-04", name: "AHU-03 Flrs 4-7",  lastSeen: minutesAgo(4),  status: "live",    pointCount: 164, activeAlarms: 3 },
  { id: "DDC-05", name: "VAV Floor 1-3",    lastSeen: minutesAgo(1),  status: "live",    pointCount: 520, activeAlarms: 1 },
  { id: "DDC-06", name: "VAV Floor 4-6",    lastSeen: minutesAgo(2),  status: "live",    pointCount: 488, activeAlarms: 0 },
  { id: "DDC-07", name: "VAV Floor 7-9",    lastSeen: minutesAgo(12), status: "stale",   pointCount: 502, activeAlarms: 2 },
  { id: "DDC-08", name: "Boiler Plant",     lastSeen: minutesAgo(18), status: "stale",   pointCount: 96,  activeAlarms: 1 },
  { id: "DDC-09", name: "Cooling Towers",   lastSeen: minutesAgo(2),  status: "live",    pointCount: 128, activeAlarms: 0 },
  { id: "DDC-10", name: "BMS Gateway",      lastSeen: minutesAgo(48), status: "offline",  pointCount: 64,  activeAlarms: 4 },
];

// ---------------------------------------------------------------------------
// 2. Prioritized Faults (sorted by estKwhPerDay descending)
// ---------------------------------------------------------------------------

export const prioritizedFaults: PrioritizedFault[] = [
  {
    id: "FLT-001",
    severity: "high",
    faultType: "Simultaneous Heating + Cooling",
    equipment: "AHU-03 Floor 7",
    floor: 7,
    durationDays: 3,
    durationLabel: "3 days",
    estKwhPerDay: 280,
    oehOpp: 3,
    oehName: "Master SAT Signal",
    status: "open",
    description:
      "AHU-03 is simultaneously calling for heating and cooling. The heating valve is at 35% open while the cooling coil is active at 60%. This indicates a supply air temperature setpoint conflict between the heating and cooling loops, wasting significant energy through mechanical fighting.",
    recommendedAction:
      "Implement a master supply air temperature (SAT) signal to coordinate heating and cooling valves. Add a deadband of 2\u00b0C between heating and cooling setpoints. Check the SAT sensor for drift or calibration issues.",
    affectedEquipmentDetails:
      "AHU-03 serves floors 5\u20137 (east wing). Heating coil valve: HV-03A (35% open). Cooling coil valve: CV-03A (60% open). SAT sensor: TS-03-SA reading 21.8\u00b0C. Heating SP: 22\u00b0C, Cooling SP: 21\u00b0C \u2014 overlapping.",
    energyImpactCalc:
      "Heating energy: ~120 kWh/day (gas boiler \u03b7 85%). Cooling energy: ~160 kWh/day (chiller COP 4.2). Total simultaneous waste: ~280 kWh/day = ~8,400 kWh/month. At \u20a9120/kWh = \u20a91,008,000/month.",
    relatedDb3Tab: "air",
  },
  {
    id: "FLT-002",
    severity: "high",
    faultType: "Economy Cycle Disabled",
    equipment: "AHU-01 Lobby",
    durationDays: 6,
    durationLabel: "6 days",
    estKwhPerDay: 190,
    oehOpp: 10,
    oehName: "Economy Cycle",
    status: "open",
    description:
      "AHU-01 economy cycle (airside economizer) has been disabled for 6 days despite outdoor conditions being favorable for free cooling. OAT has been 12\u201318\u00b0C during business hours, well below the economizer changeover point of 22\u00b0C.",
    recommendedAction:
      "Re-enable the economy cycle on AHU-01. Check the economizer damper actuator (DA-01-OA) for mechanical failure. Verify the outdoor air temperature sensor (TS-01-OA) is reading correctly. Check the BMS economizer enable schedule.",
    affectedEquipmentDetails:
      "AHU-01 serves the main lobby and floors 1\u20132. OA damper: DA-01-OA (stuck at minimum 15%). OAT sensor: TS-01-OA reading 15.2\u00b0C. Economizer changeover: 22\u00b0C. System running 100% mechanical cooling unnecessarily.",
    energyImpactCalc:
      "Mechanical cooling load that could be offset: ~190 kWh/day. Chiller energy at COP 4.2: ~45 kW additional compressor load \u00d7 10 hrs/day. Monthly waste: ~5,700 kWh = \u20a9684,000/month.",
    relatedDb3Tab: "air",
  },
  {
    id: "FLT-003",
    severity: "med",
    faultType: "HVAC Starting 90 min Early",
    equipment: "Building-wide",
    durationDays: 21,
    durationLabel: "Daily (3 wks)",
    estKwhPerDay: 150,
    oehOpp: 1,
    oehName: "Optimum Start/Stop",
    status: "ack",
    description:
      "The HVAC system is starting at 05:30 every morning, 90 minutes before the first scheduled occupancy at 07:00. The building reaches setpoint by 05:50 \u2014 well before anyone arrives. The optimum start algorithm appears to be using stale weather data or an overly conservative lead time.",
    recommendedAction:
      "Recalibrate the optimum start algorithm with current building thermal mass data. Update the weather feed integration. Reduce the maximum pre-start window from 120 min to 45 min. Monitor for 1 week after adjustment.",
    affectedEquipmentDetails:
      "All AHUs (AHU-01 through AHU-03), chillers (CH-01, CH-02), and boiler (BLR-01). Start schedule: 05:30 daily. Building reaches SP by 05:50. First occupancy: 07:00. Unnecessary run time: ~70 min/day.",
    energyImpactCalc:
      "Average system load during pre-start: ~130 kW. Unnecessary run time: 70 min/day = 1.17 hrs. Daily waste: 130 \u00d7 1.17 = ~150 kWh/day. Monthly: ~4,500 kWh = \u20a9540,000/month. Annual: ~54,000 kWh.",
    relatedDb3Tab: "air",
  },
  {
    id: "FLT-004",
    severity: "med",
    faultType: "Duct Static Pressure Fixed SP",
    equipment: "AHU-02 Floors 1-3",
    floor: 2,
    durationDays: 2,
    durationLabel: "2 days",
    estKwhPerDay: 90,
    oehOpp: 5,
    oehName: "Duct Static Pressure Reset",
    status: "open",
    description:
      "AHU-02 duct static pressure setpoint is fixed at 375 Pa \u2014 the design maximum. During low-load periods (early morning, late afternoon), all VAV boxes are less than 50% open, indicating the fan is working harder than necessary.",
    recommendedAction:
      "Implement a trim-and-respond duct static pressure reset strategy. Set minimum SP at 150 Pa, maximum at 375 Pa. Use VAV box damper positions as the reset signal \u2014 target 1\u20132 boxes at 90%+ open. Expected fan energy reduction: 25\u201340%.",
    affectedEquipmentDetails:
      "AHU-02 supply fan (SF-02): 15 kW VSD. Current static: 375 Pa (fixed). VAV boxes served: 24 units across floors 1\u20133. Average VAV damper position: 38% during low-load, 72% during peak.",
    energyImpactCalc:
      "Fan power at fixed 375 Pa: ~12 kW avg. Estimated power with reset (250 Pa avg): ~7.8 kW. Fan savings: ~4.2 kW \u00d7 14 hrs/day = ~60 kWh/day. Additional chiller savings from reduced reheat: ~30 kWh/day. Total: ~90 kWh/day.",
    relatedDb3Tab: "air",
  },
  {
    id: "FLT-005",
    severity: "med",
    faultType: "VAV Hunting / Oscillation",
    equipment: "Floor 5 East Wing",
    floor: 5,
    durationDays: 5,
    durationLabel: "5 days",
    estKwhPerDay: 65,
    oehOpp: 2,
    oehName: "Setpoints & Dead Bands",
    status: "in_progress",
    description:
      "Multiple VAV boxes on Floor 5 (east wing) are oscillating rapidly between heating and cooling modes. Zone temperatures are cycling \u00b11.5\u00b0C every 8\u201312 minutes. The deadband between heating and cooling setpoints is only 0.5\u00b0C.",
    recommendedAction:
      "Widen the deadband between heating and cooling setpoints to 2\u00b0C minimum. Retune the PID loop \u2014 reduce proportional gain by 30%, increase integral time. Consider adding a 5-minute minimum mode change timer.",
    affectedEquipmentDetails:
      "VAV boxes: VAV-5E-01 through VAV-5E-08 (8 boxes). Zone temp oscillation: \u00b11.5\u00b0C with 8\u201312 min period. Current deadband: 0.5\u00b0C. Heating SP: 22\u00b0C, Cooling SP: 22.5\u00b0C. Affected area: ~800 m\u00b2.",
    energyImpactCalc:
      "Reheat energy from unnecessary heating cycles: ~40 kWh/day. Additional cooling from overcooling cycles: ~25 kWh/day. Total: ~65 kWh/day. Plus occupant discomfort complaints on Floor 5.",
    relatedDb3Tab: "zones",
  },
  {
    id: "FLT-006",
    severity: "low",
    faultType: "CO\u2082 Low but OA Damper 100%",
    equipment: "Floor 3 Conference Zone",
    floor: 3,
    durationDays: 1,
    durationLabel: "1 day",
    estKwhPerDay: 45,
    oehOpp: 12,
    oehName: "Demand Controlled Ventilation",
    status: "open",
    description:
      "Floor 3 conference zone CO\u2082 level is 580 ppm (well below the 1000 ppm threshold) but the outdoor air damper is at 100% open. The zone appears mostly unoccupied yet is receiving maximum ventilation. DCV is either not configured or the CO\u2082 sensor is not connected to the control loop.",
    recommendedAction:
      "Configure demand-controlled ventilation (DCV) for the Floor 3 conference zone. Link the CO\u2082 sensor (CS-03-CONF) to the OA damper control logic. Set minimum OA at 20% (code minimum), ramp to 100% at 1000 ppm.",
    affectedEquipmentDetails:
      "Floor 3 conference zone OA damper: DA-03-OA (100% open). CO\u2082 sensor: CS-03-CONF reading 580 ppm. Zone area: ~200 m\u00b2. Current occupancy estimate: 5\u201310 people. Design capacity: 60 people.",
    energyImpactCalc:
      "Excess outdoor air conditioning: ~45 kWh/day. Cooling load from excess ventilation at OAT 28\u00b0C, SAT 14\u00b0C, excess airflow ~800 L/s. ~7 kW electrical at COP 4.2, over ~6.5 hrs = ~45 kWh/day.",
    relatedDb3Tab: "zones",
  },
  {
    id: "FLT-007",
    severity: "low",
    faultType: "Condenser Water Temp High",
    equipment: "Cooling Tower CT-02",
    durationDays: 4,
    durationLabel: "4 days",
    estKwhPerDay: 35,
    oehOpp: 8,
    oehName: "Condenser Water Reset",
    status: "open",
    description:
      "Cooling Tower CT-02 is returning condenser water at 32.5\u00b0C, 2.5\u00b0C above the 30\u00b0C setpoint. Fan speed is at 100%. Possible causes: fouled fill media, fan belt slippage, or the tower is undersized for current load.",
    recommendedAction:
      "Inspect CT-02 fill media for fouling or biological growth. Check fan belt tension and motor amperage. Verify water distribution nozzles are not clogged. Consider operating both towers in parallel during peak periods.",
    affectedEquipmentDetails:
      "Cooling Tower CT-02: 500 kW rejection capacity. Fan: 7.5 kW (running at 100%). CW return: 32.5\u00b0C (SP: 30\u00b0C). CW supply: 28\u00b0C. Chiller CH-01 condenser rated for 30\u00b0C entering CW.",
    energyImpactCalc:
      "Each 1\u00b0C rise in CW temp reduces chiller COP by ~2\u20133%. At 2.5\u00b0C over: ~6% efficiency loss. Chiller avg load: 200 kW thermal = ~48 kW elec. 6% loss = ~2.9 kW extra. Over 12 hrs/day: ~35 kWh/day.",
    relatedDb3Tab: "water",
  },
  {
    id: "FLT-008",
    severity: "low",
    faultType: "Filter \u0394P Exceeds Threshold",
    equipment: "AHU-01 Filter Bank",
    durationDays: 12,
    durationLabel: "12 days",
    estKwhPerDay: 20,
    oehOpp: 19,
    oehName: "Filter Maintenance",
    status: "ack",
    description:
      "AHU-01 filter bank differential pressure is 285 Pa, exceeding the 250 Pa replacement threshold. The filters have been in service for 4 months (rated life: 3 months). The increased pressure drop is forcing the supply fan to work harder.",
    recommendedAction:
      "Schedule immediate filter replacement for AHU-01. Use MERV-13 replacement filters. After replacement, verify \u0394P returns to clean-filter range (80\u2013120 Pa). Update the filter maintenance schedule.",
    affectedEquipmentDetails:
      "AHU-01 filter bank: 12 \u00d7 MERV-13 panels (600\u00d7600). Current \u0394P: 285 Pa (threshold: 250 Pa, clean: 95 Pa). Supply fan: SF-01, 22 kW VSD at 78% speed. Filter age: 4 months (rated 3 months).",
    energyImpactCalc:
      "Additional fan power due to excess \u0394P: 285 vs 95 Pa clean = 190 Pa excess. Approximate additional fan power: ~1.5 kW. Over 14 hrs/day: ~20 kWh/day. Also reducing airflow capacity.",
    relatedDb3Tab: "equipment",
  },
];

// ---------------------------------------------------------------------------
// 3. 24-Hour Demand Curve
// ---------------------------------------------------------------------------

const demandProfilePoints: [number, number][] = [
  [0, 148], [0.5, 145], [1, 142], [1.5, 140], [2, 138], [2.5, 136],
  [3, 135], [3.5, 136], [4, 138], [4.5, 142], [5, 155], [5.5, 215],
  [6, 310], [6.5, 420], [7, 530], [7.5, 600], [8, 655], [8.5, 695],
  [9, 725], [9.5, 745], [10, 758], [10.5, 768], [11, 775], [11.5, 780],
  [12, 772], [12.5, 765], [13, 772], [13.5, 785], [14, 792], [14.5, 788],
  [15, 778], [15.5, 762], [16, 738], [16.5, 705], [17, 660], [17.5, 600],
  [18, 520], [18.5, 440], [19, 370], [19.5, 318], [20, 278], [20.5, 252],
  [21, 228], [21.5, 208], [22, 192], [22.5, 178], [23, 168], [23.5, 158],
];

function interpolateProfile(hour: number): number {
  for (let i = 0; i < demandProfilePoints.length - 1; i++) {
    const [h0, v0] = demandProfilePoints[i];
    const [h1, v1] = demandProfilePoints[i + 1];
    if (hour >= h0 && hour <= h1) {
      const t = (hour - h0) / (h1 - h0);
      return v0 + t * (v1 - v0);
    }
  }
  return demandProfilePoints[demandProfilePoints.length - 1][1];
}

export const demandCurveData: DemandCurvePoint[] = Array.from(
  { length: 48 },
  (_, i) => {
    const hour = i / 2;
    const h = Math.floor(hour);
    const m = (i % 2) * 30;
    const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    const base = interpolateProfile(hour);
    const n1 = Math.sin(hour * 2.3 + 1.7) * 10;
    const n2 = Math.cos(hour * 1.8 + 0.5) * 14;
    const n3 = Math.sin(hour * 1.1 + 3.2) * 7;

    return {
      time,
      todayKw: Math.round(base * 0.93 + n1),
      yesterdayKw: Math.round(base * 1.04 + n2),
      avg7dKw: Math.round(base * 0.98 + n3),
    };
  }
);

export const demandMeta: DemandMeta = {
  peakTariffWindows: [
    { start: "09:00", end: "12:00" },
    { start: "13:00", end: "17:00" },
  ],
  ossStartWindow: { start: "05:30", end: "07:00" },
  monthPeakKw: 842,
  contractLimitKw: 950,
};

// ---------------------------------------------------------------------------
// 4. Alert Severity Heatmap (DDC x Day-of-Week)
// ---------------------------------------------------------------------------

export const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const heatmapDDCLabels = ddcStatuses.map((d) => d.id);

const heatmapMatrix: number[][] = [
  /* DDC-01 */ [0, 1, 0, 0, 1, 0, 0],
  /* DDC-02 */ [2, 3, 1, 2, 2, 0, 0],
  /* DDC-03 */ [1, 1, 2, 1, 0, 0, 0],
  /* DDC-04 */ [4, 5, 7, 6, 3, 1, 0],
  /* DDC-05 */ [1, 0, 1, 2, 1, 0, 0],
  /* DDC-06 */ [0, 0, 1, 0, 0, 0, 0],
  /* DDC-07 */ [2, 3, 4, 3, 2, 1, 0],
  /* DDC-08 */ [1, 2, 1, 3, 1, 0, 0],
  /* DDC-09 */ [0, 0, 0, 1, 0, 0, 0],
  /* DDC-10 */ [6, 8, 7, 9, 4, 2, 1],
];

const heatmapTopFaults: Record<string, string> = {
  "DDC-02": "Economy cycle disabled",
  "DDC-04": "Simultaneous H+C",
  "DDC-07": "Communication timeout",
  "DDC-08": "Boiler lockout",
  "DDC-10": "Gateway offline / packet loss",
};

export const alertHeatmapData: AlertHeatmapCell[] = [];
export const alertHeatmapTooltips: Record<string, string> = {};

for (let ddcIdx = 0; ddcIdx < heatmapMatrix.length; ddcIdx++) {
  for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
    const count = heatmapMatrix[ddcIdx][dayIdx];
    alertHeatmapData.push([dayIdx, ddcIdx, count]);
    if (count > 0) {
      const key = `${dayIdx}-${ddcIdx}`;
      const ddcId = ddcStatuses[ddcIdx].id;
      alertHeatmapTooltips[key] =
        heatmapTopFaults[ddcId] ?? "Setpoint deviation";
    }
  }
}
