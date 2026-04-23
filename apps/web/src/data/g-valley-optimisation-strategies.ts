/** G Valley — optimisation strategies from supervisory / plant / airside guides */

export type GuideSection = 2 | 3 | 4 | 5 | 6;

export type OptimisationStrategy = {
  guideNumber: number;
  section: GuideSection;
  title: string;
  shortLine: string;
  inScopeGValley: boolean;
  hero: boolean;
};

export const floorModel = {
  officeFloors: 20,
  basementFloors: ["B4", "B3", "B2", "B1"] as const,
  geothermalHeatingFloors: "1F–5F",
  towerAboveGeo: "6F–20F",
  ahuCount: 19,
} as const;

export const plantLabels = {
  chp: ["CHP-1-1", "CHP-1-2"] as const,
  coolingTowers: ["CT-1-1", "CT-1-2"] as const,
  geo: "Geothermal (1F–5F heating)",
  headers: "Cold / hot water headers",
  secondaryPumps: "Secondary CHW pumps",
  dhw: "DHW: B-1 + HWG-2",
} as const;

export const strategies: OptimisationStrategy[] = [
  { guideNumber: 1, section: 2, title: "Optimum start / stop", shortLine: "Latest start and earliest stop from building thermal response.", inScopeGValley: true, hero: true },
  { guideNumber: 2, section: 2, title: "Space temperature setpoints & bands", shortLine: "Widen dead band and proportional band to cut simultaneous heat and cool.", inScopeGValley: true, hero: true },
  { guideNumber: 3, section: 2, title: "Master AHU supply air temperature", shortLine: "Weighted VAV demand instead of high-select SAT.", inScopeGValley: true, hero: true },
  { guideNumber: 4, section: 2, title: "Chiller / compressor staging", shortLine: "Stage on load and kW, not return temperature alone.", inScopeGValley: true, hero: true },
  { guideNumber: 5, section: 3, title: "Duct static pressure reset (DSPR)", shortLine: "Trim fan speed so the most-open VAV sits near 90–95%.", inScopeGValley: true, hero: true },
  { guideNumber: 6, section: 3, title: "Heating hot water temperature reset", shortLine: "Lower HHW in mild weather; keep minimums for non-condensing boilers.", inScopeGValley: true, hero: false },
  { guideNumber: 7, section: 3, title: "Chilled water temperature reset", shortLine: "Raise CHW setpoint in mild weather to save compressor lift.", inScopeGValley: true, hero: false },
  { guideNumber: 8, section: 3, title: "Condenser water temperature reset", shortLine: "Modulate tower fans / CW setpoint for efficient condensing.", inScopeGValley: true, hero: false },
  { guideNumber: 9, section: 3, title: "Electronic expansion valves (EEV)", shortLine: "Tighter superheat control vs TXV.", inScopeGValley: false, hero: false },
  { guideNumber: 10, section: 4, title: "Economy cycle", shortLine: "Free cooling when outdoor enthalpy is favourable vs return air.", inScopeGValley: true, hero: false },
  { guideNumber: 11, section: 4, title: "Night purge / pre-cool", shortLine: "Flush residual heat with cool night air before occupancy.", inScopeGValley: true, hero: false },
  { guideNumber: 12, section: 4, title: "DCV — CO₂ in occupied spaces", shortLine: "OA on actual occupancy.", inScopeGValley: false, hero: false },
  { guideNumber: 13, section: 4, title: "DCV — CO in carparks / docks", shortLine: "Exhaust on demand.", inScopeGValley: false, hero: false },
  { guideNumber: 14, section: 5, title: "Secondary CHW ΔP reset", shortLine: "Slow secondary pumps until the most-open valve is near target.", inScopeGValley: true, hero: false },
  { guideNumber: 15, section: 5, title: "Variable head pressure (air-cooled)", shortLine: "Float condensing pressure with VSD fans.", inScopeGValley: false, hero: false },
  { guideNumber: 16, section: 5, title: "Variable head pressure (water-cooled)", shortLine: "Reduce CW flow at part load.", inScopeGValley: false, hero: false },
  { guideNumber: 17, section: 6, title: "Energy management planning", shortLine: "SMART targets and BMS trending.", inScopeGValley: false, hero: false },
  { guideNumber: 18, section: 6, title: "Training & awareness", shortLine: "Operator understanding of strategies.", inScopeGValley: false, hero: false },
  { guideNumber: 19, section: 6, title: "Energy-efficiency maintenance", shortLine: "Performance-based maintenance, calibration, override checks.", inScopeGValley: true, hero: false },
  { guideNumber: 20, section: 6, title: "BMS software & change control", shortLine: "Access, backups, logs, no ad-hoc overrides.", inScopeGValley: false, hero: false },
];

export const excludedForGValley = strategies.filter((s) => !s.inScopeGValley);
export const heroStrategies = strategies.filter((s) => s.hero);
export const catalogInScope = strategies.filter((s) => s.inScopeGValley && !s.hero);

export type PlantNodeId =
  | "ct1"
  | "ct2"
  | "chp1"
  | "chp2"
  | "geo"
  | "headers"
  | "secPump"
  | "dhw"
  | "ahuFleet";

export type PlantNodeMeta = {
  id: PlantNodeId;
  label: string;
  strategyRefs: number[];
  detail: string;
};

export const plantNodes: PlantNodeMeta[] = [
  { id: "ct1", label: "Cooling tower group CT-1-1", strategyRefs: [4, 8], detail: "Tower staging and condenser water reset affect lift and fan energy." },
  { id: "ct2", label: "Cooling tower group CT-1-2", strategyRefs: [4, 8], detail: "Parallel tower branch — same optimisation levers as CT-1-1." },
  { id: "chp1", label: "Absorption CHP-1-1", strategyRefs: [4, 7], detail: "Seasonal chiller or boiler — staging and CHW reset anchor here." },
  { id: "chp2", label: "Absorption CHP-1-2", strategyRefs: [4, 7], detail: "Second absorption machine — avoid early starts on return temp alone." },
  { id: "geo", label: plantLabels.geo, strategyRefs: [6], detail: "Heating delivery for low floors; pairs with HHW reset and setpoint discipline." },
  { id: "headers", label: plantLabels.headers, strategyRefs: [7, 14], detail: "Header ΔP and CHW temperature are primary savings interfaces." },
  { id: "secPump", label: plantLabels.secondaryPumps, strategyRefs: [14], detail: "Secondary ΔP reset trims pump speed against valve positions." },
  { id: "dhw", label: plantLabels.dhw, strategyRefs: [2, 6], detail: "Dedicated service hot water — separate from comfort CHW; still benefits from bands and HHW reset." },
  { id: "ahuFleet", label: `AHU fleet (${floorModel.ahuCount} units)`, strategyRefs: [1, 2, 3, 5, 10, 11], detail: "Airside optimum start, SAT logic, DSPR, economy and night purge." },
];
