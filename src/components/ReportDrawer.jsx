import React, { useEffect, useRef } from 'react';
import { Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import echarts from 'echarts';

const ReportDrawer = ({ visible, onClose }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (visible && chartRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }

      const option = {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '5%',
          top: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['1 月', '2 月', '3 月'],
          axisLine: {
            show: true,
            lineStyle: {
              color: 'rgba(217, 217, 217, 0.5)'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            color: '#666',
            fontSize: 11
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: 'rgba(240, 240, 240, 0.5)',
              type: 'dashed'
            }
          },
          axisLabel: {
            color: '#999',
            fontSize: 11,
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '东校区',
            type: 'bar',
            barWidth: '18%',
            barGap: '50%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#3b82f6' },
                { offset: 0.5, color: '#3b82f6' },
                { offset: 1, color: '#2563eb' }
              ]),
              barBorderRadius: [5, 5, 0, 0],
              shadowColor: 'rgba(59, 130, 246, 0.3)',
              shadowBlur: 8,
              shadowOffsetX: 0,
              shadowOffsetY: 3,
            },
            data: [8000, 11000, 3000]
          },
          {
            name: '西校区',
            type: 'bar',
            barWidth: '18%',
            barGap: '50%',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#10b981' },
                { offset: 0.5, color: '#10b981' },
                { offset: 1, color: '#059669' }
              ]),
              barBorderRadius: [5, 5, 0, 0],
              shadowColor: 'rgba(16, 185, 129, 0.3)',
              shadowBlur: 8,
              shadowOffsetX: 0,
              shadowOffsetY: 3
            },
            data: [17000, 18000, 0]
          }
        ]
      };

      chartInstance.current.setOption(option);

      const handleResize = () => {
        if (chartInstance.current) {
          chartInstance.current.resize();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [visible]);

  useEffect(() => {
    if (!visible && chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }
  }, [visible]);

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      width={480}
      closeIcon={null}
      bodyStyle={{ padding: 0 }}
      maskClosable={true}
      headerStyle={{ display: 'none', padding: 0, height: 0 }}
      style={{ pointerEvents: 'none' }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #F0F4FF 0%, #E8EEFF 100%)',
        display: 'flex',
        flexDirection: 'column',
        pointerEvents: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 12px 20px',
          borderBottom: '1px solid rgba(217, 217, 217, 0.3)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#2563eb',
              letterSpacing: '1px'
            }}>
              AI REPORT QUERY
            </div>
            <div
              onClick={onClose}
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
              }}
            >
              <CloseOutlined style={{ fontSize: '14px', color: '#666' }} />
            </div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            AI 报表查询结果
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.6' }}>
            系统根据当前筛选条件自动汇总为图表报告，无需二次导出 Excel 再处理。
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '20px'
        }}>
          {/* Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>查询笔数</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>5 笔</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>西校区总额</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>22,776 元</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>东校区总额</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>35,328 元</div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderRadius: '12px',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}>
              <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>合计金额</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937' }}>58,104 元</div>
            </div>
          </div>

          {/* Chart Section */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937' }}>
                东西校区月度水费对比
              </div>
              <div style={{
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid #e5e7eb',
                borderRadius: '16px',
                fontSize: '12px',
                color: '#6b7280'
              }}>
                柱状图
              </div>
            </div>

            <div
              ref={chartRef}
              style={{
                width: '100%',
                height: '260px'
              }}
            />

            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: 'rgba(249, 250, 251, 0.6)',
              backdropFilter: 'blur(8px)',
              borderRadius: '8px',
              fontSize: '12px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              根据当前查询结果自动识别出"时间 + 校区"这类适合做对比图的结构。
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default ReportDrawer;
