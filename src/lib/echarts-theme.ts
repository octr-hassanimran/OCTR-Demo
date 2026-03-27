export const octrTheme = {
  color: ["#52B788", "#2D6A4F", "#40916C", "#95D5B2", "#E57373"],
  backgroundColor: "transparent",
  textStyle: {
    color: "#E8F5E9",
    fontFamily: "Plus Jakarta Sans, Inter, system-ui, sans-serif",
    fontSize: 12,
  },
  title: {
    textStyle: { color: "#E8F5E9", fontWeight: 600, fontSize: 14 },
    subtextStyle: { color: "#A7C4B5" },
  },
  tooltip: {
    backgroundColor: "rgba(17,27,22,0.95)",
    borderColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    textStyle: { color: "#E8F5E9", fontSize: 12 },
  },
  axisPointer: {
    lineStyle: { color: "#52B788", width: 1 },
    crossStyle: { color: "#52B788", width: 1 },
  },
  grid: {
    containLabel: true,
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
    axisLabel: { color: "#A7C4B5", fontSize: 11 },
    splitLine: { show: false },
  },
  valueAxis: {
    axisLine: { show: false },
    axisLabel: { color: "#A7C4B5", fontSize: 11 },
    splitLine: { lineStyle: { color: "rgba(255,255,255,0.07)" } },
  },
  legend: {
    textStyle: { color: "#A7C4B5", fontSize: 11 },
  },
  line: {
    smooth: true,
    symbol: "none",
    lineStyle: { width: 2 },
  },
  bar: {
    itemStyle: { borderRadius: [4, 4, 0, 0] },
  },
};
