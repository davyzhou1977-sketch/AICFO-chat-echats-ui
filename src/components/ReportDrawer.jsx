import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BulbOutlined, CloseOutlined } from '@ant-design/icons';
import echarts from 'echarts';
import './ReportDrawer.css';

const chartData = {
  categories: ['1 月', '2 月', '3 月'],
  westCampus: [8200, 11200, 3376],
  eastCampus: [16800, 18100, 428]
};

function getDefaultChartType(categories) {
  const timeLikePattern = /(月|周|日|季度|年)/;
  return categories.some((label) => timeLikePattern.test(label)) ? 'line' : 'bar';
}

function formatCurrency(value) {
  return new Intl.NumberFormat('zh-CN').format(value);
}

const ReportDrawer = ({ visible, onClose }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [chartType, setChartType] = useState(getDefaultChartType(chartData.categories));

  const summary = useMemo(() => {
    const totalWest = chartData.westCampus.reduce((sum, value) => sum + value, 0);
    const totalEast = chartData.eastCampus.reduce((sum, value) => sum + value, 0);
    const totalAmount = totalWest + totalEast;
    const combinedMonthly = chartData.categories.map((_, index) => chartData.westCampus[index] + chartData.eastCampus[index]);
    const peakMonthIndex = combinedMonthly.indexOf(Math.max.apply(null, combinedMonthly));
    const peakMonth = chartData.categories[peakMonthIndex];
    const dominantCampus = totalEast > totalWest ? '东校区' : '西校区';

    return {
      totalWest,
      totalEast,
      totalAmount,
      dominantCampus,
      peakMonth,
      insight: `2026年1-3月水费共 ${formatCurrency(totalAmount)} 元，其中${dominantCampus}支出更高，${peakMonth}达到阶段峰值。建议后续补充校区面积或人数口径后，再看单位成本是否存在优化空间。`
    };
  }, []);

  const buildChartOption = (chartWidth = 320) => {
    const categories = chartData.categories;
    const westCampusData = chartData.westCampus;
    const eastCampusData = chartData.eastCampus;
    const seriesCount = 2;
    const categoryCount = categories.length || 1;

    const computedBarWidth = Math.max(
      20,
      Math.min(30, Math.round(chartWidth / (categoryCount * (seriesCount * 3))))
    );

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
        textStyle: {
          color: '#f8fafc',
          fontSize: 12
        }
      },
      grid: {
        left: 34,
        right: 12,
        bottom: 16,
        top: 14,
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
        max: 21000,
        interval: 3000,
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
        },
        splitArea: {
          show: false
        }
      },
      series: [
        {
          name: '西校区',
          type: chartType,
          smooth: chartType === 'line',
          symbol: chartType === 'line' ? 'circle' : 'none',
          symbolSize: chartType === 'line' ? 7 : 0,
          showSymbol: true,
          barWidth: computedBarWidth,
          barMaxWidth: 30,
          barMinHeight: 2,
          barGap: '12%',
          barCategoryGap: '22%',
          lineStyle: {
            width: 3,
            color: '#2d5ef2'
          },
          itemStyle: {
            color: chartType === 'line'
              ? '#2d5ef2'
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#4d7cff' },
                  { offset: 1, color: '#2d5ef2' }
                ]),
            barBorderRadius: [8, 8, 0, 0]
          },
          animationDuration: 720,
          animationDelay(idx) {
            return idx * 100;
          },
          areaStyle: chartType === 'line' ? { color: 'transparent' } : undefined,
          data: westCampusData
        },
        {
          name: '东校区',
          type: chartType,
          smooth: chartType === 'line',
          symbol: chartType === 'line' ? 'circle' : 'none',
          symbolSize: chartType === 'line' ? 7 : 0,
          showSymbol: true,
          barWidth: computedBarWidth,
          barMaxWidth: 30,
          barMinHeight: 2,
          barGap: '12%',
          barCategoryGap: '22%',
          lineStyle: {
            width: 3,
            color: '#1eaf74'
          },
          itemStyle: {
            color: chartType === 'line'
              ? '#1eaf74'
              : new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#31cf93' },
                  { offset: 1, color: '#1eaf74' }
                ]),
            barBorderRadius: [8, 8, 0, 0]
          },
          animationDuration: 720,
          animationDelay(idx) {
            return 120 + idx * 100;
          },
          areaStyle: chartType === 'line' ? { color: 'transparent' } : undefined,
          data: eastCampusData
        }
      ]
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
  }, [visible, chartType]);

  useEffect(() => {
    if (!visible && chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

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
          <div className="report-drawer-metrics">
            <div className="report-metric-card">
              <div className="report-metric-label">查询笔数</div>
              <div className="report-metric-value">5 笔</div>
            </div>
            <div className="report-metric-card">
              <div className="report-metric-label">西校区总额</div>
              <div className="report-metric-value">{formatCurrency(summary.totalWest)} 元</div>
            </div>
            <div className="report-metric-card">
              <div className="report-metric-label">东校区总额</div>
              <div className="report-metric-value">{formatCurrency(summary.totalEast)} 元</div>
            </div>
            <div className="report-metric-card">
              <div className="report-metric-label">合计金额</div>
              <div className="report-metric-value">{formatCurrency(summary.totalAmount)} 元</div>
            </div>
          </div>

          <section className="report-chart-card">
            <div className="report-chart-header">
              <div className="report-chart-title">
                {chartType === 'line' ? '东西校区月度水费趋势' : '东西校区月度水费对比'}
              </div>
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
                ? '若继续选择更多月份，系统将沿用同一趋势图口径自动扩展。'
                : '根据当前查询结果自动识别出 "时间 + 校区" 这类适合做对比图的结构。'}
            </div>
          </section>

          <section className="report-insight-card">
            <div className="report-insight-header">
              <div className="report-insight-icon">
                <BulbOutlined />
              </div>
              <div className="report-insight-title">一句话摘要</div>
            </div>
            <p className="report-insight-text">{summary.insight}</p>
            <div className="report-insight-divider" />
            <div className="report-insight-footnote">
              当前轻量版只输出图表、汇总金额和一句话结论，为查询者提供即时决策支持。
            </div>
          </section>
        </div>
      </div>
    </aside>
  );
};

export default ReportDrawer;
