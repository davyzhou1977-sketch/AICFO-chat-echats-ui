import { useEffect, useRef } from "react";
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/grid";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";
import styles from "./index.less";

interface ChartProps {
  option: any;
  className?: string;
}

export function Chart({ option, className }: ChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(containerRef.current);
    }

    instanceRef.current.setOption(option, true);

    const handleResize = () => {
      instanceRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [option]);

  useEffect(() => {
    return () => {
      instanceRef.current?.dispose();
      instanceRef.current = null;
    };
  }, []);

  const classNames = [styles.chart, className].filter(Boolean).join(" ");

  return <div ref={containerRef} className={classNames} />;
}
