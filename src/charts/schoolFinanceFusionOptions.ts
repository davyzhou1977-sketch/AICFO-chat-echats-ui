import type { EChartsOption } from "echarts";
import type {
  BudgetDepartmentCompletionItem,
  BudgetStandardExpenseItem,
} from "@/types/schoolFinanceFusion";

const axisLabelColor = "#64748B";
const splitLineColor = "#E2E8F0";

export function getBudgetCompletionRingOption(completionRate: number): EChartsOption {
  const safeRate = Math.max(0, Math.min(completionRate, 100));

  return {
    animation: true,
    animationDuration: 700,
    animationEasing: "cubicOut",
    series: [
      {
        type: "pie",
        radius: ["74%", "88%"],
        center: ["50%", "56%"],
        silent: true,
        label: { show: false },
        data: [
          {
            value: safeRate,
            itemStyle: {
              color: "#00A2AD",
              borderRadius: 999,
            },
          },
          {
            value: Math.max(100 - safeRate, 0),
            itemStyle: {
              color: "#E5F6FC",
            },
          },
        ],
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "43%",
        style: {
          text: "完成率",
          fill: "#898F96",
          fontSize: 13,
        },
      },
      {
        type: "text",
        left: "center",
        top: "53%",
        style: {
          text: `${safeRate.toFixed(2)}%`,
          fill: "#07090C",
          fontSize: 18,
          fontWeight: 700,
        },
      },
    ],
  };
}

export function getBudgetDepartmentBarOption(
  items: BudgetDepartmentCompletionItem[],
): EChartsOption {
  const count = Math.max(items.length, 1);
  const computedBarWidth = Math.max(16, Math.min(42, Math.round(96 / count)));

  return {
    animation: true,
    animationDuration: 650,
    animationEasing: "cubicOut",
    grid: { top: 18, right: 10, bottom: 50, left: 10, containLabel: true },
    xAxis: {
      type: "category",
      data: items.map((item) => item.departmentName),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: splitLineColor } },
      axisLabel: {
        color: axisLabelColor,
        fontSize: 11,
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      name: "%",
      nameTextStyle: {
        color: axisLabelColor,
        fontSize: 11,
        padding: [0, 0, 0, -10],
      },
      axisLabel: {
        color: axisLabelColor,
        fontSize: 11,
      },
      splitLine: {
        lineStyle: {
          color: splitLineColor,
          type: "dashed",
        },
      },
    },
    series: [
      {
        type: "bar",
        data: items.map((item) => item.ratio),
        barWidth: computedBarWidth,
        barCategoryGap: count <= 3 ? "28%" : count <= 5 ? "34%" : "42%",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#1BC0CB" },
              { offset: 1, color: "#00A2AD" },
            ],
          },
          borderRadius: [999, 999, 0, 0],
        },
      },
    ],
  };
}

export function getBudgetStandardExpenseOption(
  totalAmount: number,
  highlightLabel: string,
  highlightRate: number,
  items: BudgetStandardExpenseItem[],
): EChartsOption {
  const safeRate = Math.max(0, Math.min(highlightRate, 100));

  return {
    animation: true,
    animationDuration: 700,
    animationEasing: "cubicOut",
    tooltip: {
      trigger: "item",
      formatter: (params: any) =>
        `${params.name}<br/>${Number(params.value ?? 0).toLocaleString("zh-CN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} 元`,
    },
    series: [
      {
        type: "pie",
        radius: ["58%", "80%"],
        center: ["50%", "50%"],
        label: { show: false },
        itemStyle: {
          borderColor: "#FFFFFF",
          borderWidth: 4,
          borderRadius: 10,
        },
        data: items.map((item) => ({
          name: item.label,
          value: item.amount,
          itemStyle: { color: item.color },
        })),
      },
    ],
    graphic: [
      {
        type: "text",
        left: "center",
        top: "40%",
        style: {
          text: highlightLabel,
          fill: "#64748B",
          fontSize: 12,
        },
      },
      {
        type: "text",
        left: "center",
        top: "50%",
        style: {
          text: `${safeRate.toFixed(0)}%`,
          fill: "#0F172A",
          fontSize: 22,
          fontWeight: 700,
        },
      },
      {
        type: "text",
        left: "center",
        top: "62%",
        style: {
          text: `总额 ${totalAmount.toLocaleString("zh-CN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`,
          fill: "#94A3B8",
          fontSize: 11,
        },
      },
    ],
  };
}
