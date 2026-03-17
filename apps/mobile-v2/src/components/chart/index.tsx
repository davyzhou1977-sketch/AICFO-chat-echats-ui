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
    const container = containerRef.current;

    if (!container) {
      return;
    }

    if (!instanceRef.current) {
      instanceRef.current = echarts.init(container);
    }

    instanceRef.current.setOption(option, true);

    let resizeFrame = window.requestAnimationFrame(() => {
      instanceRef.current?.resize();
    });
    const resize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(() => {
        instanceRef.current?.resize();
      });
    };

    window.addEventListener("resize", resize);

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(resize);
      observer.observe(container);
    }

    return () => {
      window.cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", resize);
      observer?.disconnect();
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
