import type { EChartsOption } from "echarts";
import type {
  CategoryItem,
  InvestmentCompareItem,
  MonthlyTrendItem,
  RankingItem,
} from "@/types/schoolFinance";

const axisLabelColor = "#64748B";
const splitLineColor = "#E2E8F0";

export function getMonthlyTrendOption(data: MonthlyTrendItem[]): EChartsOption {
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
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisTick: { show: false },
    },
    yAxis: [
      {
        type: "value",
        axisLabel: { color: axisLabelColor, fontSize: 11 },
        splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
      },
      {
        type: "value",
        show: false,
      },
    ],
    series: [
      {
        name: "报销金额",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3, color: "#0B72F6" },
        itemStyle: { color: "#0B72F6", borderColor: "#fff", borderWidth: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(11,114,246,0.22)" },
              { offset: 1, color: "rgba(11,114,246,0.02)" },
            ],
          },
        },
        data: data.map((item) => item.amount),
      },
      {
        name: "报销笔数",
        type: "line",
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#00A2AD" },
        itemStyle: { color: "#00A2AD", borderColor: "#fff", borderWidth: 2 },
        data: data.map((item) => item.count),
      },
    ],
  };
}

export function getExpenseCategoryOption(data: CategoryItem[]): EChartsOption {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c}%",
    },
    series: [
      {
        type: "pie",
        radius: ["56%", "78%"],
        center: ["50%", "48%"],
        avoidLabelOverlap: true,
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
        top: "39%",
        style: {
          text: "类别",
          fill: "#64748B",
          fontSize: 12,
        },
      },
      {
        type: "text",
        left: "center",
        top: "49%",
        style: {
          text: "100%",
          fill: "#0F172A",
          fontSize: 24,
          fontWeight: 700,
        },
      },
    ],
  };
}

export function getVendorRankingOption(data: RankingItem[]): EChartsOption {
  const reversed = [...data].reverse();

  return {
    grid: { top: 12, right: 8, bottom: 0, left: 8, containLabel: true },
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
        width: 112,
        overflow: "truncate",
        fontSize: 11,
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
              { offset: 0, color: "#1BC0CB" },
              { offset: 1, color: "#00A2AD" },
            ],
          },
          borderRadius: [999, 999, 999, 999],
        },
        label: {
          show: true,
          position: "right",
          formatter: ({ value }) => `${value}${reversed[0]?.unit ?? "万"}`,
          color: "#475569",
          fontSize: 11,
        },
      },
    ],
  };
}

export function getResourceFlowOption(data: CategoryItem[]): EChartsOption {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c}%",
    },
    series: [
      {
        type: "pie",
        radius: ["54%", "82%"],
        center: ["50%", "48%"],
        startAngle: 90,
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
        top: "39%",
        style: {
          text: "资源",
          fill: "#64748B",
          fontSize: 12,
        },
      },
      {
        type: "text",
        left: "center",
        top: "49%",
        style: {
          text: "100%",
          fill: "#0F172A",
          fontSize: 24,
          fontWeight: 700,
        },
      },
    ],
  };
}

export function getInvestmentCompareOption(
  data: InvestmentCompareItem[],
): EChartsOption {
  return {
    grid: { top: 20, right: 12, bottom: 16, left: 12, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: "#475569", fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { show: false },
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        type: "bar",
        data: data.map((item) => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: [14, 14, 0, 0],
          },
        })),
        barWidth: "38%",
        label: {
          show: true,
          position: "top",
          formatter: "{c}%",
          color: "#334155",
          fontSize: 11,
        },
      },
    ],
  };
}

export function getStructureTrendOption(
  data: { month: string; student: number; teacher: number; operation: number }[],
): EChartsOption {
  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.88)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
    },
    legend: {
      top: 0,
      icon: "circle",
      itemWidth: 8,
      itemHeight: 8,
      textStyle: { color: "#64748B", fontSize: 11 },
    },
    grid: { top: 36, right: 12, bottom: 18, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) => item.month),
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "学生端",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#2F6BFF" },
        itemStyle: { color: "#2F6BFF" },
        data: data.map((item) => item.student),
      },
      {
        name: "教师端",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#18B47A" },
        itemStyle: { color: "#18B47A" },
        data: data.map((item) => item.teacher),
      },
      {
        name: "运转端",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#FF9F43" },
        itemStyle: { color: "#FF9F43" },
        data: data.map((item) => item.operation),
      },
    ],
  };
}
