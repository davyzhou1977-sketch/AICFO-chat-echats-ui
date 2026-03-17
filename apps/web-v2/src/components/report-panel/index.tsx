import { useMemo } from "react";
import { Chart } from "@/components/chart/index";
import type { ChartMode, ReportData } from "@/data/report";
import styles from "./index.less";

interface ReportPanelProps {
  data: ReportData["drawer"];
  mode: ChartMode;
  onModeChange: (mode: ChartMode) => void;
}

const numberFormatter = new Intl.NumberFormat("zh-CN");

function buildChartOption(data: ReportData["drawer"], mode: ChartMode) {
  return {
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(15, 24, 42, 0.92)",
      borderWidth: 0,
      textStyle: {
        color: "#f8fafc",
      },
      formatter(params: any[]) {
        const lines = params.map(
          (item) => `${item.seriesName}: ${numberFormatter.format(Number(item.value))} 元`,
        );
        return `${params[0]?.axisValue}<br/>${lines.join("<br/>")}`;
      },
    },
    legend: {
      bottom: 0,
      itemWidth: 10,
      itemHeight: 10,
      textStyle: {
        color: "#51627d",
      },
    },
    grid: {
      left: 18,
      right: 18,
      top: 28,
      bottom: 52,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: data.labels,
      axisTick: { show: false },
      axisLine: {
        lineStyle: {
          color: "#dbe3f0",
        },
      },
      axisLabel: {
        color: "#607089",
      },
    },
    yAxis: {
      type: "value",
      axisTick: { show: false },
      axisLine: { show: false },
      splitLine: {
        lineStyle: {
          color: "#e8eef8",
          type: "dashed",
        },
      },
      axisLabel: {
        color: "#607089",
        formatter(value: number) {
          return `${Math.round(value / 1000)}k`;
        },
      },
    },
    series: data.series.map((item) => ({
      name: item.name,
      type: mode,
      data: item.data,
      smooth: mode === "line",
      symbol: mode === "line" ? "circle" : "none",
      symbolSize: 7,
      barMaxWidth: 26,
      itemStyle: {
        color:
          mode === "bar"
            ? {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: item.color },
                  { offset: 1, color: "#dbe8ff" },
                ],
              }
            : item.color,
        barBorderRadius: [10, 10, 0, 0],
      },
      lineStyle: {
        width: 3,
        color: item.color,
      },
    })),
  };
}

export function ReportPanel({ data, mode, onModeChange }: ReportPanelProps) {
  const option = useMemo(() => buildChartOption(data, mode), [data, mode]);

  return (
    <aside className={styles.panel}>
      <div className={styles.header}>
        <div>
          <div className={styles.kicker}>AI REPORT QUERY</div>
          <h2 className={styles.title}>{data.title}</h2>
          <p className={styles.description}>{data.description}</p>
        </div>
        <div className={styles.switcher}>
          <button
            type="button"
            className={mode === "bar" ? styles.switcherActive : styles.switcherButton}
            onClick={() => onModeChange("bar")}
          >
            柱状图
          </button>
          <button
            type="button"
            className={mode === "line" ? styles.switcherActive : styles.switcherButton}
            onClick={() => onModeChange("line")}
          >
            折线图
          </button>
        </div>
      </div>

      <div className={styles.metricGrid}>
        {data.summaryMetrics.map((metric) => (
          <div key={metric.label} className={styles.metricCard}>
            <span className={styles.metricLabel}>{metric.label}</span>
            <strong className={styles.metricValue}>{metric.value}</strong>
          </div>
        ))}
      </div>

      <div className={styles.chartCard}>
        <div className={styles.chartTitle}>校区水费变化</div>
        <Chart option={option} />
      </div>

      <div className={styles.insightCard}>
        <div className={styles.insightTitle}>AI 解读</div>
        <p className={styles.insightText}>{data.insight}</p>
      </div>
    </aside>
  );
}
