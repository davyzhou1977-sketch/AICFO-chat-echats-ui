import type { EChartsOption } from "echarts";
import type {
  GovernanceFlowItem,
  GovernanceSplitItem,
  GovernanceTrendItem,
  GrassrootsUnitBudgetItem,
  LowActivityUnitItem,
  TeacherMomentumItem,
  TeacherTrendItem,
} from "@/types/schoolFinanceGovernance";

const axisLabelColor = "#64748B";
const splitLineColor = "#E2E8F0";

export function getGovernanceFlowDonutOption(
  data: GovernanceFlowItem[],
): EChartsOption {
  return {
    tooltip: {
      trigger: "item",
      formatter: "{b}<br/>{c} 万",
    },
    series: [
      {
        type: "pie",
        radius: ["54%", "80%"],
        center: ["50%", "48%"],
        startAngle: 120,
        itemStyle: {
          borderColor: "#FFFFFF",
          borderWidth: 4,
          borderRadius: 12,
        },
        label: { show: false },
        data,
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "37%",
        style: {
          text: "可治理池",
          fill: "#64748B",
          fontSize: 12,
        },
      },
      {
        type: "text",
        left: "center",
        top: "48%",
        style: {
          text: `${data.reduce((total, item) => total + item.value, 0)}万`,
          fill: "#0F172A",
          fontSize: 24,
          fontWeight: 700,
        },
      },
    ],
  };
}

export function getGovernanceFlowBarOption(
  data: GovernanceFlowItem[],
): EChartsOption {
  const reversed = [...data].reverse();

  return {
    grid: { top: 10, right: 12, bottom: 0, left: 12, containLabel: true },
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
        width: 120,
        overflow: "truncate",
      },
    },
    series: [
      {
        type: "bar",
        data: reversed.map((item) => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: [999, 999, 999, 999],
          },
        })),
        barWidth: 12,
        label: {
          show: true,
          position: "right",
          formatter: "{c}万",
          color: "#475569",
          fontSize: 11,
        },
      },
    ],
  };
}

export function getStudentGovernanceStackedOption(
  data: GovernanceSplitItem[],
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
    grid: { top: 36, right: 8, bottom: 18, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.shortName),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: {
        color: axisLabelColor,
        fontSize: 11,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "基层自主",
        type: "bar",
        stack: "governance",
        data: data.map((item) => item.grassroots),
        barWidth: "48%",
        itemStyle: {
          color: "#2F6BFF",
          borderRadius: [10, 10, 0, 0],
        },
      },
      {
        name: "行政统筹",
        type: "bar",
        stack: "governance",
        data: data.map((item) => item.administrative),
        barWidth: "48%",
        itemStyle: {
          color: "#94A3B8",
          borderRadius: [10, 10, 0, 0],
        },
      },
    ],
  };
}

export function getStudentAdministrativeTrendOption(
  data: GovernanceTrendItem[],
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
      textStyle: { color: axisLabelColor, fontSize: 11 },
    },
    grid: { top: 36, right: 12, bottom: 18, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) => item.month),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "学生类投入",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#2F6BFF" },
        itemStyle: { color: "#2F6BFF" },
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
        data: data.map((item) => item.student),
      },
      {
        name: "行政类投入",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 7,
        lineStyle: { width: 3, color: "#FF9F43" },
        itemStyle: { color: "#FF9F43" },
        data: data.map((item) => item.administrative),
      },
    ],
  };
}

export function getGrassrootsBudgetDualBarOption(
  data: GrassrootsUnitBudgetItem[],
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
    grid: { top: 36, right: 8, bottom: 18, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: {
        color: axisLabelColor,
        fontSize: 11,
        interval: 0,
      },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "核定预算",
        type: "bar",
        data: data.map((item) => item.allocated),
        barWidth: "28%",
        itemStyle: {
          color: "#CBD5E1",
          borderRadius: [10, 10, 0, 0],
        },
      },
      {
        name: "已使用金额",
        type: "bar",
        data: data.map((item) => item.used),
        barWidth: "28%",
        itemStyle: {
          color: "#2F6BFF",
          borderRadius: [10, 10, 0, 0],
        },
      },
    ],
  };
}

export function getLowActivityRankingOption(
  data: LowActivityUnitItem[],
): EChartsOption {
  const reversed = [...data].reverse();

  return {
    grid: { top: 10, right: 12, bottom: 0, left: 12, containLabel: true },
    xAxis: {
      type: "value",
      show: false,
      max: 100,
    },
    yAxis: {
      type: "category",
      data: reversed.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        color: "#334155",
        fontSize: 11,
        width: 112,
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
              { offset: 0, color: "#FDBA74" },
              { offset: 1, color: "#F97316" },
            ],
          },
          borderRadius: [999, 999, 999, 999],
        },
        label: {
          show: true,
          position: "right",
          formatter: "{c}%",
          color: "#475569",
          fontSize: 11,
        },
      },
    ],
  };
}

export function getTeacherMomentumBarOption(
  data: TeacherMomentumItem[],
): EChartsOption {
  const reversed = [...data].reverse();

  return {
    grid: { top: 10, right: 12, bottom: 0, left: 12, containLabel: true },
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
        width: 120,
        overflow: "truncate",
      },
    },
    series: [
      {
        type: "bar",
        data: reversed.map((item) => ({
          value: item.value,
          itemStyle: {
            color: item.color,
            borderRadius: [999, 999, 999, 999],
          },
        })),
        barWidth: 12,
        label: {
          show: true,
          position: "right",
          formatter: "{c}万",
          color: "#475569",
          fontSize: 11,
        },
      },
    ],
  };
}

export function getTeacherMomentumTrendOption(
  data: TeacherTrendItem[],
): EChartsOption {
  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.88)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
    },
    grid: { top: 18, right: 12, bottom: 18, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((item) => item.month),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "教师发展投入",
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: { width: 3, color: "#18B47A" },
        itemStyle: { color: "#18B47A", borderColor: "#fff", borderWidth: 2 },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(24,180,122,0.2)" },
              { offset: 1, color: "rgba(24,180,122,0.02)" },
            ],
          },
        },
        data: data.map((item) => item.value),
      },
    ],
  };
}
