import type { EChartsOption } from "echarts";
import type {
  ControlClosureTrendItem,
  ControlDepartmentRiskItem,
  ControlRiskThemeItem,
  ControlRuleHitItem,
  ControlTrendItem,
} from "@/types/schoolFinance";

const axisLabelColor = "#64748B";
const splitLineColor = "#E2E8F0";

export function getControlRiskTrendOption(data: ControlTrendItem[]): EChartsOption {
  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.88)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
    },
    grid: { top: 24, right: 16, bottom: 24, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) => item.month),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: axisLabelColor,
          fontSize: 11,
          formatter: "{value}%",
        },
        splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
      },
      {
        type: "value",
        show: false,
      },
    ],
    series: [
      {
        name: "风险命中率",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3, color: "#2F6BFF" },
        itemStyle: { color: "#2F6BFF", borderColor: "#fff", borderWidth: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(47,107,255,0.22)" },
              { offset: 1, color: "rgba(47,107,255,0.02)" },
            ],
          },
        },
        data: data.map((item) => item.hitRate),
      },
      {
        name: "命中单量",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#F97316" },
        itemStyle: { color: "#F97316", borderColor: "#fff", borderWidth: 2 },
        data: data.map((item) => item.riskCount),
      },
    ],
  };
}

export function getControlRiskThemeDonutOption(
  data: ControlRiskThemeItem[],
): EChartsOption {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c}次 · {d}%",
    },
    series: [
      {
        type: "pie",
        radius: ["56%", "80%"],
        center: ["50%", "48%"],
        itemStyle: {
          borderColor: "#FFFFFF",
          borderWidth: 4,
          borderRadius: 10,
        },
        label: { show: false },
        data,
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "38%",
        style: {
          text: "风险命中",
          fill: axisLabelColor,
          fontSize: 12,
        },
      },
      {
        type: "text",
        left: "center",
        top: "48%",
        style: {
          text: `${total}`,
          fill: "#0F172A",
          fontSize: 24,
          fontWeight: 700,
        },
      },
    ],
  };
}

export function getControlHorizontalRankingOption(
  data: ControlRuleHitItem[],
  palette: { from: string; to: string } = { from: "#7FA6FF", to: "#2F6BFF" },
): EChartsOption {
  const reversed = [...data].reverse();

  return {
    grid: { top: 10, right: 10, bottom: 0, left: 8, containLabel: true },
    xAxis: {
      type: "value",
      show: false,
    },
    yAxis: {
      type: "category",
      data: reversed.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#334155",
        fontSize: 11,
        width: 132,
        overflow: "truncate",
      },
    },
    series: [
      {
        type: "bar",
        data: reversed.map((item) => item.value),
        barWidth: 12,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: palette.from },
              { offset: 1, color: palette.to },
            ],
          },
          borderRadius: [999, 999, 999, 999],
        },
        label: {
          show: true,
          position: "right",
          formatter: ({ value }) => `${value}${reversed[0]?.unit ?? "次"}`,
          color: "#475569",
          fontSize: 11,
        },
      },
    ],
  };
}

export function getControlDepartmentStackedOption(
  data: ControlDepartmentRiskItem[],
): EChartsOption {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(15, 23, 42, 0.88)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
    },
    legend: {
      top: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: axisLabelColor, fontSize: 11 },
    },
    grid: { top: 38, right: 12, bottom: 16, left: 12, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: "#475569", fontSize: 11, interval: 0 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "提示",
        type: "bar",
        stack: "risk",
        barWidth: "42%",
        itemStyle: { color: "#93C5FD", borderRadius: [0, 0, 0, 0] },
        data: data.map((item) => item.prompt),
      },
      {
        name: "关注",
        type: "bar",
        stack: "risk",
        barWidth: "42%",
        itemStyle: { color: "#FBBF24", borderRadius: [0, 0, 0, 0] },
        data: data.map((item) => item.attention),
      },
      {
        name: "高风险",
        type: "bar",
        stack: "risk",
        barWidth: "42%",
        itemStyle: { color: "#F97316", borderRadius: [10, 10, 0, 0] },
        data: data.map((item) => item.high),
      },
    ],
  };
}

export function getControlClosureTrendOption(
  data: ControlClosureTrendItem[],
): EChartsOption {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      backgroundColor: "rgba(15, 23, 42, 0.88)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
    },
    legend: {
      top: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: axisLabelColor, fontSize: 11 },
    },
    grid: { top: 38, right: 12, bottom: 16, left: 12, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.month),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: "#475569", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "发现风险",
        type: "bar",
        data: data.map((item) => item.found),
        barWidth: "28%",
        itemStyle: { color: "#CBD5E1", borderRadius: [10, 10, 0, 0] },
      },
      {
        name: "完成整改",
        type: "bar",
        data: data.map((item) => item.resolved),
        barWidth: "28%",
        itemStyle: { color: "#2F6BFF", borderRadius: [10, 10, 0, 0] },
      },
    ],
  };
}
