import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { CSSProperties } from "react";
import type { EChartsOption } from "echarts";
import type { EChartsType } from "echarts/core";
import { BarChart, LineChart, PieChart } from "echarts/charts";
import {
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { init, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

use([
  BarChart,
  LineChart,
  PieChart,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

interface ChartProps {
  option: EChartsOption;
  className?: string;
  style?: CSSProperties;
}

export interface ChartRef {
  resize: () => void;
  getInstance: () => EChartsType | null;
}

export const Chart = forwardRef<ChartRef, ChartProps>(function Chart(
  { option, className, style },
  ref,
) {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<EChartsType | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      resize: () => instanceRef.current?.resize(),
      getInstance: () => instanceRef.current,
    }),
    [],
  );

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = init(chartRef.current);
    instanceRef.current = chart;
    chart.setOption(option);

    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.dispose();
      instanceRef.current = null;
    };
  }, [option]);

  return <div ref={chartRef} className={className} style={style} />;
});
