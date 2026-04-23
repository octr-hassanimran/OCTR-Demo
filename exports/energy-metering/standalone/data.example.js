// Standalone Energy Metering demo data (replace with real numbers).
// Contract: month "YYYY-MM", status "ACTUAL" | "PROJECTED"
//
// Notes:
// - Values are intentionally lightweight; this file is meant to be swapped out by the demo builder.
// - All currency values are in KRW. The UI displays M₩.

window.METERING_DATA = {
  combined: [
    // 2026 Jan–Apr actuals, May+ projected (example only)
    { month: "2026-01", status: "ACTUAL", total_cost_krw: 74_796_159, total_saved_krw: 24_869_902, savings_rate: 0.3325 },
    { month: "2026-02", status: "ACTUAL", total_cost_krw: 59_830_043, total_saved_krw: 17_945_697, savings_rate: 0.2999 },
    { month: "2026-03", status: "ACTUAL", total_cost_krw: 48_669_537, total_saved_krw: 15_141_917, savings_rate: 0.3111 },
    { month: "2026-04", status: "ACTUAL", total_cost_krw: 50_398_379, total_saved_krw: 15_549_538, savings_rate: 0.3085 },
    { month: "2026-05", status: "PROJECTED", total_cost_krw: 62_249_230, total_saved_krw: 20_942_576, savings_rate: 0.3364 },
    { month: "2026-06", status: "PROJECTED", total_cost_krw: 84_199_238, total_saved_krw: 27_943_219, savings_rate: 0.3319 },
    { month: "2026-07", status: "PROJECTED", total_cost_krw: 102_872_273, total_saved_krw: 35_272_727, savings_rate: 0.3429 },
    { month: "2026-08", status: "PROJECTED", total_cost_krw: 114_137_914, total_saved_krw: 35_284_856, savings_rate: 0.3091 },
  ],

  electricity: [
    { month: "2026-01", status: "ACTUAL", baseline_kwh: 336_528, octr_kwh: 225_299, saved_kwh: 111_229, actual_cost_krw: 65_761_214, cost_saved_krw: 21_735_351, savings_rate: 0.3305 },
    { month: "2026-02", status: "ACTUAL", baseline_kwh: 276_768, octr_kwh: 194_087, saved_kwh: 82_681, actual_cost_krw: 55_367_043, cost_saved_krw: 16_540_216, savings_rate: 0.2987 },
    { month: "2026-03", status: "ACTUAL", baseline_kwh: 267_480, octr_kwh: 184_115, saved_kwh: 83_365, actual_cost_krw: 45_869_528, cost_saved_krw: 14_296_071, savings_rate: 0.3117 },
    { month: "2026-04", status: "ACTUAL", baseline_kwh: 267_300, octr_kwh: 184_707, saved_kwh: 82_593, actual_cost_krw: 46_919_716, cost_saved_krw: 14_497_718, savings_rate: 0.3090 },
    { month: "2026-05", status: "PROJECTED", baseline_kwh: 308_736, octr_kwh: 205_143, saved_kwh: 103_593, actual_cost_krw: 52_543_576, cost_saved_krw: 17_630_424, savings_rate: 0.3355 },
    { month: "2026-06", status: "PROJECTED", baseline_kwh: 346_536, octr_kwh: 231_331, saved_kwh: 115_205, actual_cost_krw: 71_329_857, cost_saved_krw: 23_713_427, savings_rate: 0.3324 },
  ],

  gas: [
    { month: "2026-01", status: "ACTUAL", baseline_m3: 8_699, octr_m3: 5_681, saved_m3: 3_018, actual_cost_krw: 9_034_945, cost_saved_krw: 3_134_552, savings_rate: 0.3470 },
    { month: "2026-02", status: "ACTUAL", baseline_m3: 4_471, octr_m3: 3_063, saved_m3: 1_408, actual_cost_krw: 4_463_000, cost_saved_krw: 1_405_481, savings_rate: 0.3149 },
    { month: "2026-03", status: "ACTUAL", baseline_m3: 2_827, octr_m3: 1_973, saved_m3: 854, actual_cost_krw: 2_800_009, cost_saved_krw: 845_846, savings_rate: 0.3022 },
    { month: "2026-04", status: "ACTUAL", baseline_m3: 4_316, octr_m3: 3_011, saved_m3: 1_305, actual_cost_krw: 3_478_663, cost_saved_krw: 1_051_820, savings_rate: 0.3024 },
    { month: "2026-05", status: "PROJECTED", baseline_m3: 16_190, octr_m3: 10_665, saved_m3: 5_525, actual_cost_krw: 9_705_654, cost_saved_krw: 3_312_152, savings_rate: 0.3413 },
    { month: "2026-06", status: "PROJECTED", baseline_m3: 21_663, octr_m3: 14_543, saved_m3: 7_120, actual_cost_krw: 12_869_381, cost_saved_krw: 4_229_792, savings_rate: 0.3287 },
  ],
};

