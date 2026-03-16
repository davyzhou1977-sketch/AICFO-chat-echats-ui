import type { EChartsOption } from "echarts";
import type {
  BudgetExecutionTrendItem,
  BudgetProjectCompareItem,
  ChartSeries,
  MultiSeriesDataset,
  RankingItem,
  SingleSeriesDataset,
} from "@/types/schoolFinanceV2";

const axisLabelColor = "#64748B";
const splitLineColor = "#E2E8F0";

function seriesGradient(color: string) {
  return {
    type: "linear" as const,
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: `${color}E6` },
      { offset: 1, color: `${color}55` },
    ],
  };
}

function buildLineSeries(series: ChartSeries[]) {
  return series.map((item) => ({
    name: item.name,
    type: "line" as const,
    smooth: true,
    symbol: "circle" as const,
    symbolSize: 7,
    data: item.data,
    lineStyle: { width: 3, color: item.color },
    itemStyle: { color: item.color, borderColor: "#fff", borderWidth: 2 },
  }));
}

export function getBudgetExecutionOverviewOption(
  data: BudgetExecutionTrendItem[],
): EChartsOption {
  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 23, 42, 0.88)",
      borderWidth: 0,
      textStyle: { color: "#fff" },
    },
    grid: { top: 20, right: 18, bottom: 16, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.month),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: [
      {
        type: "value",
        axisLabel: { color: axisLabelColor, fontSize: 11 },
        splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
      },
      {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { color: axisLabelColor, fontSize: 11, formatter: "{value}%" },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "预算金额",
        type: "bar" as const,
        data: data.map((item) => item.budget),
        barWidth: 16,
        itemStyle: {
          color: "#DBEAFE",
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: "已执行",
        type: "bar" as const,
        data: data.map((item) => item.executed),
        barWidth: 16,
        itemStyle: {
          color: "#2F6BFF",
          borderRadius: [8, 8, 0, 0],
        },
      },
      {
        name: "执行率",
        type: "line" as const,
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle" as const,
        symbolSize: 7,
        lineStyle: { width: 3, color: "#F97316" },
        itemStyle: { color: "#F97316", borderColor: "#fff", borderWidth: 2 },
        data: data.map((item) => item.rate),
      },
    ],
  };
}

export function getBudgetProjectCompareOption(
  data: BudgetProjectCompareItem[],
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { top: 20, right: 12, bottom: 36, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisTick: { show: false },
      axisLabel: { color: axisLabelColor, fontSize: 11, interval: 0 },
      axisLine: { lineStyle: { color: splitLineColor } },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11 },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: [
      {
        name: "预算金额",
        type: "bar" as const,
        barWidth: 14,
        data: data.map((item) => item.budget),
        itemStyle: { color: "#BFDBFE", borderRadius: [8, 8, 0, 0] },
      },
      {
        name: "已执行金额",
        type: "bar" as const,
        barWidth: 14,
        data: data.map((item) => item.executed),
        itemStyle: { color: "#2563EB", borderRadius: [8, 8, 0, 0] },
      },
    ],
  };
}

export function getStackedBarOption(
  dataset: MultiSeriesDataset,
  unit = "万",
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { top: 18, right: 12, bottom: 20, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: dataset.labels,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11, formatter: `{value}${unit}` },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: dataset.series.map((item) => ({
      name: item.name,
      type: "bar" as const,
      stack: "total",
      barWidth: 18,
      data: item.data,
      itemStyle: {
        color: seriesGradient(item.color),
        borderRadius: [8, 8, 0, 0],
      },
    })),
  };
}

export function getMultiLineOption(
  dataset: MultiSeriesDataset,
  unit = "万",
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { top: 18, right: 12, bottom: 20, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: dataset.labels,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11, formatter: `{value}${unit}` },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: buildLineSeries(dataset.series),
  };
}

export function getSingleLineOption(
  dataset: SingleSeriesDataset,
  unit = "万",
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { top: 18, right: 12, bottom: 20, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: dataset.labels,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: { color: axisLabelColor, fontSize: 11, formatter: `{value}${unit}` },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: buildLineSeries([
      {
        name: dataset.name,
        color: dataset.color,
        data: dataset.data,
      },
    ]),
  };
}

export function getHorizontalRankingOption(
  data: RankingItem[],
  valueFormatter?: (value: number, unit: string) => string,
): EChartsOption {
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
        width: 116,
        overflow: "truncate",
        fontSize: 11,
      },
    },
    series: [
      {
        type: "bar" as const,
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
          formatter: (params: any) => {
            const numericValue = Number(params.value ?? 0);
            const item = reversed.find((entry) => entry.value === numericValue) ?? reversed[0];
            return valueFormatter
              ? valueFormatter(numericValue, item?.unit ?? "")
              : `${numericValue}${item?.unit ?? ""}`;
          },
          color: "#475569",
          fontSize: 11,
        },
      },
    ],
  };
}

export function getFocusedProjectOption(
  data: Array<{ name: string; budget: number; executed: number; rate: number }>,
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { top: 20, right: 18, bottom: 20, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: data.map((item) => item.name),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11, interval: 0 },
    },
    yAxis: [
      {
        type: "value",
        axisLabel: { color: axisLabelColor, fontSize: 11 },
        splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
      },
      {
        type: "value",
        min: 0,
        max: 100,
        axisLabel: { color: axisLabelColor, fontSize: 11, formatter: "{value}%" },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: "预算",
        type: "bar" as const,
        barWidth: 14,
        data: data.map((item) => item.budget),
        itemStyle: { color: "#C7D2FE", borderRadius: [8, 8, 0, 0] },
      },
      {
        name: "执行",
        type: "bar" as const,
        barWidth: 14,
        data: data.map((item) => item.executed),
        itemStyle: { color: "#4F46E5", borderRadius: [8, 8, 0, 0] },
      },
      {
        name: "执行率",
        type: "line" as const,
        yAxisIndex: 1,
        smooth: true,
        symbol: "circle" as const,
        symbolSize: 7,
        lineStyle: { width: 3, color: "#10B981" },
        itemStyle: { color: "#10B981", borderColor: "#fff", borderWidth: 2 },
        data: data.map((item) => item.rate),
      },
    ],
  };
}

export function getGroupedBarOption(
  dataset: MultiSeriesDataset,
  valueFormatter?: (value: number) => string,
): EChartsOption {
  return {
    tooltip: { trigger: "axis" },
    grid: { top: 20, right: 12, bottom: 24, left: 12, containLabel: true },
    xAxis: {
      type: "category",
      data: dataset.labels,
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: { color: axisLabelColor, fontSize: 11 },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: axisLabelColor,
        fontSize: 11,
        formatter: valueFormatter ? (value: number) => valueFormatter(value) : undefined,
      },
      splitLine: { lineStyle: { color: splitLineColor, type: "dashed" } },
    },
    series: dataset.series.map((item) => ({
      name: item.name,
      type: "bar" as const,
      barWidth: 18,
      data: item.data,
      itemStyle: {
        color: item.color,
        borderRadius: [8, 8, 0, 0],
      },
    })),
  };
}
