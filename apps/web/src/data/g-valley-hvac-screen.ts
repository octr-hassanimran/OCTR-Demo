import type { PlantNodeId } from "@/data/g-valley-optimisation-strategies";

export type CalloutConfidence = "exact" | "approx" | "tbd";
export type PipeMedium = "cold" | "warm" | "neutral" | "signal";
export type PipeDirection = "up" | "down" | "left" | "right" | "mixed";
export type ScreenNodeKind =
  | "tower"
  | "towerControl"
  | "chp"
  | "header"
  | "pumpBank"
  | "geo"
  | "floorPanel"
  | "ahuFleet"
  | "branch";

export type ScreenNodeId =
  | "ct11Control"
  | "ct12Control"
  | "ct11Tower"
  | "ct12Tower"
  | "chp1"
  | "chp2"
  | "coldSupplyHeader"
  | "coldReturnHeader"
  | "secPumpCluster"
  | "geoPumpCluster"
  | "ahuFleet"
  | "floorServicePanel"
  | "systemControl"
  | "geoBranch"
  | "chsBranch";

export type HvacScreenNode = {
  id: ScreenNodeId;
  kind: ScreenNodeKind;
  tagKo: string;
  tagEn: string;
  roleKo: string;
  roleEn: string;
  orientation: PipeDirection;
  /** React Flow absolute coordinates in canvas units */
  pos: { x: number; y: number };
  basePlantId?: PlantNodeId;
};

export type HvacPipeSegment = {
  id: string;
  source: ScreenNodeId;
  target: ScreenNodeId;
  medium: PipeMedium;
  direction: PipeDirection;
  branch: "primary" | "secondary" | "service";
};

export type FloorServiceGroup = {
  id: string;
  labelKo: string;
  labelEn: string;
  targetNodes: ScreenNodeId[];
  targetEdges: string[];
};

export type ValueCallout = {
  id: string;
  labelKo: string;
  labelEn: string;
  value: string;
  unit?: string;
  confidence: CalloutConfidence;
  /** Percent anchor relative to detailed canvas area */
  anchor: { xPct: number; yPct: number };
  relatedNode: ScreenNodeId;
};

export const hvacScreenNodes: HvacScreenNode[] = [
  {
    id: "ct11Control",
    kind: "towerControl",
    tagKo: "CT-1-2 CONTROL",
    tagEn: "CT-1-2 CONTROL",
    roleKo: "냉각탑 제어반",
    roleEn: "Cooling tower control",
    orientation: "down",
    pos: { x: 20, y: 28 },
    basePlantId: "ct1",
  },
  {
    id: "ct12Control",
    kind: "towerControl",
    tagKo: "CT-1-1 CONTROL",
    tagEn: "CT-1-1 CONTROL",
    roleKo: "냉각탑 제어반",
    roleEn: "Cooling tower control",
    orientation: "down",
    pos: { x: 212, y: 28 },
    basePlantId: "ct2",
  },
  {
    id: "ct11Tower",
    kind: "tower",
    tagKo: "냉각탑 1",
    tagEn: "Cooling tower 1",
    roleKo: "응축수 열방출",
    roleEn: "Condenser heat rejection",
    orientation: "down",
    pos: { x: 48, y: 148 },
    basePlantId: "ct1",
  },
  {
    id: "ct12Tower",
    kind: "tower",
    tagKo: "냉각탑 2",
    tagEn: "Cooling tower 2",
    roleKo: "응축수 열방출",
    roleEn: "Condenser heat rejection",
    orientation: "down",
    pos: { x: 240, y: 148 },
    basePlantId: "ct2",
  },
  {
    id: "chp1",
    kind: "chp",
    tagKo: "CHP-1-1",
    tagEn: "CHP-1-1",
    roleKo: "흡수식 냉온수기",
    roleEn: "Absorption chiller-heater",
    orientation: "right",
    pos: { x: 398, y: 332 },
    basePlantId: "chp1",
  },
  {
    id: "chp2",
    kind: "chp",
    tagKo: "CHP-1-2",
    tagEn: "CHP-1-2",
    roleKo: "흡수식 냉온수기",
    roleEn: "Absorption chiller-heater",
    orientation: "right",
    pos: { x: 588, y: 332 },
    basePlantId: "chp2",
  },
  {
    id: "coldSupplyHeader",
    kind: "header",
    tagKo: "냉온수 공급메인",
    tagEn: "CHW/HW supply header",
    roleKo: "공급 헤더",
    roleEn: "Supply manifold",
    orientation: "right",
    pos: { x: 798, y: 198 },
    basePlantId: "headers",
  },
  {
    id: "coldReturnHeader",
    kind: "header",
    tagKo: "냉온수 환수메인",
    tagEn: "CHW/HW return header",
    roleKo: "환수 헤더",
    roleEn: "Return manifold",
    orientation: "left",
    pos: { x: 806, y: 108 },
    basePlantId: "headers",
  },
  {
    id: "secPumpCluster",
    kind: "pumpBank",
    tagKo: "냉온수 순환펌프",
    tagEn: "Secondary pumps",
    roleKo: "2차 냉온수 펌프군",
    roleEn: "Secondary CHW/HW pumps",
    orientation: "right",
    pos: { x: 898, y: 342 },
    basePlantId: "secPump",
  },
  {
    id: "geoPumpCluster",
    kind: "pumpBank",
    tagKo: "지열2차 냉온수펌프",
    tagEn: "Geothermal secondary pumps",
    roleKo: "지열 분기 펌프군",
    roleEn: "Geo branch pump bank",
    orientation: "right",
    pos: { x: 1090, y: 332 },
    basePlantId: "geo",
  },
  {
    id: "geoBranch",
    kind: "branch",
    tagKo: "지열 시스템",
    tagEn: "Geothermal system",
    roleKo: "저층 난방 분기",
    roleEn: "Low-floor heating branch",
    orientation: "right",
    pos: { x: 1012, y: 208 },
    basePlantId: "geo",
  },
  {
    id: "chsBranch",
    kind: "branch",
    tagKo: "냉수 분기",
    tagEn: "Chilled water branch",
    roleKo: "업무시설 냉방 공급",
    roleEn: "Office cooling branch",
    orientation: "up",
    pos: { x: 718, y: 68 },
    basePlantId: "headers",
  },
  {
    id: "ahuFleet",
    kind: "ahuFleet",
    tagKo: "AHU-01 ~ AHU-19",
    tagEn: "AHU fleet",
    roleKo: "공조기 계통",
    roleEn: "Air handling units",
    orientation: "right",
    pos: { x: 1128, y: 68 },
    basePlantId: "ahuFleet",
  },
  {
    id: "floorServicePanel",
    kind: "floorPanel",
    tagKo: "업무시설 서비스층",
    tagEn: "Served floor groups",
    roleKo: "층별 공급 매핑",
    roleEn: "Floor-service map",
    orientation: "mixed",
    pos: { x: 560, y: 22 },
  },
  {
    id: "systemControl",
    kind: "branch",
    tagKo: "지원 시스템",
    tagEn: "Auxiliary system",
    roleKo: "보조제어/유틸",
    roleEn: "Auxiliary controls",
    orientation: "mixed",
    pos: { x: 1090, y: 462 },
    basePlantId: "dhw",
  },
];

export const hvacPipeSegments: HvacPipeSegment[] = [
  { id: "seg-ct11-control", source: "ct11Control", target: "ct11Tower", medium: "signal", direction: "down", branch: "secondary" },
  { id: "seg-ct12-control", source: "ct12Control", target: "ct12Tower", medium: "signal", direction: "down", branch: "secondary" },
  { id: "seg-ct11-chp1", source: "ct11Tower", target: "chp1", medium: "neutral", direction: "down", branch: "primary" },
  { id: "seg-ct12-chp2", source: "ct12Tower", target: "chp2", medium: "neutral", direction: "down", branch: "primary" },
  { id: "seg-chp1-supply", source: "chp1", target: "coldSupplyHeader", medium: "cold", direction: "right", branch: "primary" },
  { id: "seg-chp2-supply", source: "chp2", target: "coldSupplyHeader", medium: "cold", direction: "right", branch: "primary" },
  { id: "seg-supply-pumps", source: "coldSupplyHeader", target: "secPumpCluster", medium: "cold", direction: "right", branch: "primary" },
  { id: "seg-pumps-geo", source: "secPumpCluster", target: "geoPumpCluster", medium: "cold", direction: "right", branch: "secondary" },
  { id: "seg-geo-branch", source: "geoPumpCluster", target: "geoBranch", medium: "cold", direction: "up", branch: "service" },
  { id: "seg-header-floor", source: "coldSupplyHeader", target: "chsBranch", medium: "cold", direction: "up", branch: "service" },
  { id: "seg-floor-ahu", source: "chsBranch", target: "ahuFleet", medium: "cold", direction: "right", branch: "service" },
  { id: "seg-ahu-return", source: "ahuFleet", target: "coldReturnHeader", medium: "warm", direction: "left", branch: "service" },
  { id: "seg-return-chp1", source: "coldReturnHeader", target: "chp1", medium: "warm", direction: "left", branch: "primary" },
  { id: "seg-return-chp2", source: "coldReturnHeader", target: "chp2", medium: "warm", direction: "left", branch: "primary" },
];

export const floorServiceGroups: FloorServiceGroup[] = [
  {
    id: "f-5-20",
    labelKo: "5F~20F 업무시설 외주부 냉난방(복측존)",
    labelEn: "Floors 5–20 perimeter office zone HVAC",
    targetNodes: ["chsBranch", "ahuFleet"],
    targetEdges: ["seg-header-floor", "seg-floor-ahu"],
  },
  {
    id: "f-3-20",
    labelKo: "3F~20F 업무시설 외주부 냉난방(남측존)",
    labelEn: "Floors 3–20 south perimeter HVAC",
    targetNodes: ["chsBranch", "ahuFleet"],
    targetEdges: ["seg-header-floor", "seg-floor-ahu"],
  },
  {
    id: "f-6-20",
    labelKo: "6F~20F 업무시설 내주부 냉난방",
    labelEn: "Floors 6–20 interior office HVAC",
    targetNodes: ["coldSupplyHeader", "ahuFleet"],
    targetEdges: ["seg-supply-pumps", "seg-floor-ahu"],
  },
  {
    id: "f-1-5",
    labelKo: "1F~5F 로비/업무시설 내주부 냉난방",
    labelEn: "Floors 1–5 lobby/interior branch HVAC",
    targetNodes: ["geoBranch", "geoPumpCluster"],
    targetEdges: ["seg-pumps-geo", "seg-geo-branch"],
  },
];

export const valueCallouts: ValueCallout[] = [
  { id: "v-ct11-high", labelKo: "냉수FT", labelEn: "CHW flow temp", value: "31", unit: "°C", confidence: "exact", anchor: { xPct: 12.5, yPct: 16.8 }, relatedNode: "ct11Control" },
  { id: "v-ct11-mid", labelKo: "냉각온도1", labelEn: "Cooling temp 1", value: "29", unit: "°C", confidence: "exact", anchor: { xPct: 12.5, yPct: 21.5 }, relatedNode: "ct11Control" },
  { id: "v-ct11-low", labelKo: "냉각온도2", labelEn: "Cooling temp 2", value: "30", unit: "°C", confidence: "exact", anchor: { xPct: 12.5, yPct: 26.3 }, relatedNode: "ct11Control" },
  { id: "v-ct12-high", labelKo: "냉수FT", labelEn: "CHW flow temp", value: "31", unit: "°C", confidence: "exact", anchor: { xPct: 26.6, yPct: 16.8 }, relatedNode: "ct12Control" },
  { id: "v-ct12-mid", labelKo: "냉각온도1", labelEn: "Cooling temp 1", value: "29", unit: "°C", confidence: "exact", anchor: { xPct: 26.6, yPct: 21.5 }, relatedNode: "ct12Control" },
  { id: "v-ct12-low", labelKo: "냉각온도2", labelEn: "Cooling temp 2", value: "30", unit: "°C", confidence: "exact", anchor: { xPct: 26.6, yPct: 26.3 }, relatedNode: "ct12Control" },
  { id: "v-tower1", labelKo: "냉각수 온도", labelEn: "Cooling tower outlet", value: "32.9", unit: "°C", confidence: "exact", anchor: { xPct: 16.4, yPct: 47.3 }, relatedNode: "ct11Tower" },
  { id: "v-tower2", labelKo: "냉각수 온도", labelEn: "Cooling tower outlet", value: "30.8", unit: "°C", confidence: "exact", anchor: { xPct: 24.0, yPct: 47.2 }, relatedNode: "ct12Tower" },
  { id: "v-pipe-left-mid", labelKo: "헤더 압력", labelEn: "Header pressure", value: "12.8", unit: "bar", confidence: "exact", anchor: { xPct: 31.7, yPct: 41.4 }, relatedNode: "coldReturnHeader" },
  { id: "v-pipe-left-low", labelKo: "배관온도", labelEn: "Pipe temp", value: "33.1", unit: "°C", confidence: "exact", anchor: { xPct: 31.4, yPct: 61.2 }, relatedNode: "coldReturnHeader" },
  { id: "v-main-pressure", labelKo: "압력", labelEn: "Main pressure", value: "14", unit: "bar", confidence: "exact", anchor: { xPct: 58.0, yPct: 43.8 }, relatedNode: "coldReturnHeader" },
  { id: "v-main-mid", labelKo: "압력", labelEn: "Main pressure", value: "0.8", unit: "bar", confidence: "approx", anchor: { xPct: 64.1, yPct: 46.0 }, relatedNode: "coldReturnHeader" },
  { id: "v-setpoint", labelKo: "설정압력", labelEn: "Set pressure", value: "1.2", unit: "bar", confidence: "exact", anchor: { xPct: 63.4, yPct: 56.2 }, relatedNode: "coldSupplyHeader" },
  { id: "v-main-temp-1", labelKo: "배관온도", labelEn: "Pipe temp", value: "18.5", unit: "°C", confidence: "exact", anchor: { xPct: 49.6, yPct: 62.4 }, relatedNode: "coldSupplyHeader" },
  { id: "v-main-temp-2", labelKo: "배관온도", labelEn: "Pipe temp", value: "18.8", unit: "°C", confidence: "exact", anchor: { xPct: 71.8, yPct: 62.6 }, relatedNode: "coldSupplyHeader" },
  { id: "v-pump-freq-1", labelKo: "운전주파수", labelEn: "Pump frequency", value: "60.0", unit: "Hz", confidence: "exact", anchor: { xPct: 66.4, yPct: 71.0 }, relatedNode: "secPumpCluster" },
  { id: "v-pump-freq-2", labelKo: "운전주파수", labelEn: "Pump frequency", value: "50.0", unit: "Hz", confidence: "exact", anchor: { xPct: 66.3, yPct: 76.7 }, relatedNode: "secPumpCluster" },
  { id: "v-pump-line-temp", labelKo: "배관온도", labelEn: "Line temp", value: "20.3", unit: "°C", confidence: "exact", anchor: { xPct: 71.8, yPct: 77.8 }, relatedNode: "secPumpCluster" },
  { id: "v-geo-head", labelKo: "헤더압", labelEn: "Geo header pressure", value: "1.9", unit: "bar", confidence: "exact", anchor: { xPct: 89.2, yPct: 41.6 }, relatedNode: "geoPumpCluster" },
  { id: "v-geo-main", labelKo: "헤더압", labelEn: "Geo line pressure", value: "5.4", unit: "bar", confidence: "exact", anchor: { xPct: 92.4, yPct: 36.4 }, relatedNode: "geoPumpCluster" },
  { id: "v-geo-temp-1", labelKo: "배관온도", labelEn: "Geo line temp", value: "12.2", unit: "°C", confidence: "exact", anchor: { xPct: 95.4, yPct: 70.9 }, relatedNode: "geoPumpCluster" },
  { id: "v-geo-temp-2", labelKo: "배관온도", labelEn: "Geo line temp", value: "10.7", unit: "°C", confidence: "approx", anchor: { xPct: 95.3, yPct: 77.6 }, relatedNode: "geoPumpCluster" },
  { id: "v-left-line-mid", labelKo: "배관온도", labelEn: "Pipe temp", value: "31.4", unit: "°C", confidence: "exact", anchor: { xPct: 22.4, yPct: 62.6 }, relatedNode: "ct12Tower" },
  { id: "v-unclear-bottom", labelKo: "하부 지시값", labelEn: "Lower indicator", value: "TBD", confidence: "tbd", anchor: { xPct: 36.6, yPct: 60.7 }, relatedNode: "chp1" },
];

export const bilingualLabels: Record<string, { ko: string; en: string }> = {
  coldSupplyMain: { ko: "냉온수 공급메인", en: "CHW/HW supply main" },
  coldReturnMain: { ko: "냉온수 환수메인", en: "CHW/HW return main" },
  geoSecondaryPump: { ko: "지열2차 냉온수펌프", en: "Geothermal secondary pump" },
  chilledWaterPump: { ko: "냉각수 펌프", en: "Cooling water pump" },
};

/** Logical canvas size for callout anchors and flow bounds (matches spread node layout). */
export const SCREEN_CANVAS = {
  width: 1300,
  height: 560,
} as const;
