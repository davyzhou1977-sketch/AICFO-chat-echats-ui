import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BulbOutlined, CloseOutlined } from '@ant-design/icons';
import echarts from 'echarts';
import './ReportDrawer.css';
import { buildReimbursementViewModel, formatCurrency } from '../lib/reimbursementMockAdapter';

const chartColors = ['#2d5ef2', '#1eaf74', '#f59e0b'];

const ReportDrawer = ({ visible, onClose, records = [] }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const reportData = useMemo(() => buildReimbursementViewModel(records), [records]);
  const [chartType, setChartType] = useState(reportData.defaultChartType);

  useEffect(() => {
    setChartType(reportData.defaultChartType);
  }, [reportData.defaultChartType]);

  const buildChartOption = (chartWidth = 320) => {
    const categories = reportData.chartData.labels;
    const seriesCount = reportData.chartData.series.length || 1;
    const categoryCount = categories.length || 1;
    const computedBarWidth = Math.max(
      20,
      Math.min(30, Math.round(chartWidth / (categoryCount * (seriesCount * 2.7))))
    );
    const maxValue = Math.max(
      0,
      ...reportData.chartData.series.flatMap((item) => item.data.map((value) => Number(value || 0)))
    );
    const yAxisMax = maxValue > 0 ? Math.ceil(maxValue / 3000) * 3000 : 3000;

    return {
      animationDuration: 850,
      animationDurationUpdate: 500,
      animationEasing: 'cubicOut',
      animationEasingUpdate: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: chartType === 'line' ? 'line' : 'shadow',
          lineStyle: {
            color: 'rgba(98, 113, 138, 0.32)',
            width: 1
          },
          shadowStyle: {
            color: 'rgba(62, 101, 255, 0.06)'
          }
        },
        backgroundColor: 'rgba(22, 29, 45, 0.88)',
        borderWidth: 0,
        padding: [10, 12],
        formatter(params) {
          const lines = params.map((item) => `${item.seriesName}: ${formatCurrency(item.value)} 元`);
          return `${params[0].axisValue}<br/>${lines.join('<br/>')}`;
        },
        textStyle: {
          color: '#f8fafc',
          fontSize: 12
        }
      },
      legend: {
        show: false
      },
      grid: {
        left: 40,
        right: 12,
        bottom: 16,
        top: 20,
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#d9dee8'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#7f8ba3',
          fontSize: 12,
          margin: 10
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: yAxisMax,
        interval: Math.max(1000, Math.ceil(yAxisMax / 4)),
        splitLine: {
          show: true,
          lineStyle: {
            color: '#d5dce7',
            type: 'dashed'
          }
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: '#7f8ba3',
          fontSize: 12,
          margin: 12,
          formatter(value) {
            return chartType === 'line' ? `${formatCurrency(value)}元` : formatCurrency(value);
          }
        }
      },
      series: reportData.chartData.series.map((item, index) => ({
        name: item.name,
        type: chartType,
        smooth: chartType === 'line',
        symbol: chartType === 'line' ? 'circle' : 'none',
        symbolSize: chartType === 'line' ? 7 : 0,
        showSymbol: true,
        barWidth: computedBarWidth,
        barMaxWidth: 30,
        barMinHeight: 2,
        barGap: '12%',
        barCategoryGap: '20%',
        lineStyle: {
          width: 3,
          color: chartColors[index % chartColors.length]
        },
        itemStyle: {
          color: chartType === 'line'
            ? chartColors[index % chartColors.length]
            : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: echarts.color.lift(chartColors[index % chartColors.length], 0.15) },
                { offset: 1, color: chartColors[index % chartColors.length] }
              ]),
          barBorderRadius: [8, 8, 0, 0]
        },
        animationDuration: 720,
        animationDelay(dataIndex) {
          return index * 120 + dataIndex * 90;
        },
        areaStyle: chartType === 'line' ? { color: 'transparent' } : undefined,
        data: item.data
      }))
    };
  };

  useEffect(() => {
    if (visible && chartRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      chartInstance.current.setOption(buildChartOption(chartRef.current.clientWidth), true);

      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.setOption(buildChartOption(chartRef.current?.clientWidth), true);
          chartInstance.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [visible, chartType, reportData]);

  useEffect(() => {
    if (!visible && chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  const chartTitle = chartType === 'line'
    ? `${reportData.filters.campus}月度${reportData.filters.topic}趋势`
    : `${reportData.filters.campus}月度${reportData.filters.topic}对比`;

  return (
    <aside className="report-drawer-shell">
      <div className="report-drawer-panel">
        <div className="report-drawer-header">
          <div>
            <div className="report-drawer-kicker">AI REPORT QUERY</div>
            <h2 className="report-drawer-title">AI报表查询结果</h2>
            <p className="report-drawer-description">
              系统根据当前筛选条件自动汇总为图表报告，无需
              <br />
              二次导出 Excel 再处理。
            </p>
          </div>
          <button type="button" className="report-drawer-close" onClick={onClose}>
            <CloseOutlined />
          </button>
        </div>

        <div className="report-drawer-content">
          <div className="report-drawer-metrics report-drawer-metrics-compact">
            {reportData.summaryMetrics.map((metric) => (
              <div key={metric.label} className="report-metric-card">
                <div className="report-metric-label">{metric.label}</div>
                <div className="report-metric-value">{metric.value}</div>
              </div>
            ))}
          </div>

          <section className="report-chart-card">
            <div className="report-chart-header">
              <div className="report-chart-title">{chartTitle}</div>
              <div className="report-chart-switch">
                <button
                  type="button"
                  className={`report-chart-tag ${chartType === 'bar' ? 'report-chart-tag-active' : ''}`}
                  onClick={() => setChartType('bar')}
                >
                  柱状图
                </button>
                <button
                  type="button"
                  className={`report-chart-tag ${chartType === 'line' ? 'report-chart-tag-active' : ''}`}
                  onClick={() => setChartType('line')}
                >
                  折线图
                </button>
              </div>
            </div>

            <div ref={chartRef} className="report-chart-canvas" />

            <div className="report-chart-note">
              {chartType === 'line'
                ? '当前查询结果同时具备时间与校区两个维度，更适合先用趋势图查看月度变化。'
                : '将同一组记录切换为柱状图后，更便于快速比较不同校区在各月份的金额高低。'}
            </div>
          </section>

          <section className="report-insight-card">
            <div className="report-insight-header">
              <div className="report-insight-icon">
                <BulbOutlined />
              </div>
              <div className="report-insight-title">AI解读</div>
            </div>
            <p className="report-insight-text">{reportData.insight.summary}</p>
            <div className="report-insight-divider" />
            <div className="report-insight-footnote">{reportData.insight.footnote}</div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default ReportDrawer;
