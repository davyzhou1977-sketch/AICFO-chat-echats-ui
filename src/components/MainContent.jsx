import React, { useMemo, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import {
  BarChartOutlined,
  BellOutlined,
  DownloadOutlined,
  MessageOutlined,
  SettingOutlined
} from '@ant-design/icons';
import AISidebar from './AISidebar';
import ReportDrawer from './ReportDrawer';
import reimbursementRecords from '../data/reimbursement-production-export.mock.json';
import { buildReimbursementViewModel, formatCurrency } from '../lib/reimbursementMockAdapter';
import './MainContent.css';

const MainContent = () => {
  const [aiSidebarVisible, setAiSidebarVisible] = useState(false);
  const [reportDrawerVisible, setReportDrawerVisible] = useState(true);
  const viewModel = useMemo(() => buildReimbursementViewModel(reimbursementRecords), []);

  const columns = [
    {
      title: '单据编号',
      dataIndex: 'code',
      key: 'code',
      width: 190,
      render: (value) => <span className="bill-table-code">{value}</span>,
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status) => {
        const color = status === '已通过' ? 'green' : status === '待提交' ? 'orange' : 'blue';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '报销事由',
      dataIndex: 'reason',
      key: 'reason',
      width: 360,
      render: (value) => <span className="bill-table-reason">{value}</span>,
    },
    {
      title: '申请部门',
      dataIndex: 'department',
      key: 'department',
      width: 160,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'applicant',
      width: 120,
    },
    {
      title: '申请时间',
      dataIndex: 'date',
      key: 'date',
      width: 130,
    },
    {
      title: '核销金额',
      dataIndex: 'verifyAmount',
      key: 'verifyAmount',
      width: 130,
      align: 'right',
      render: (amount) => <span>{formatCurrency(amount)}.00</span>,
    },
    {
      title: '报销金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 130,
      align: 'right',
      render: (amount) => <span>{formatCurrency(amount)}.00</span>,
    },
  ];

  const filterChips = [
    `审批状态：${viewModel.filters.status}`,
    `报销事由：${viewModel.filters.topic}`,
    `时间范围：2026年${viewModel.filters.period}`,
    `校区：${viewModel.filters.campus}`,
  ];

  return (
    <main className="bill-main-shell">
      <header className="bill-topbar">
        <div />
        <div className="bill-topbar-right">
          <div className="bill-topbar-bell">
            <BellOutlined />
            <span className="bill-topbar-badge">99+</span>
          </div>
          <div className="bill-topbar-year">2025财年</div>
          <div className="bill-topbar-user">
            <div className="bill-topbar-avatar">管</div>
            <span>管老师_1</span>
          </div>
        </div>
      </header>

      <section className="bill-page-shell">
        <div className="bill-page-titlebar">
          <div className="bill-page-title">报销单</div>
          <div className="bill-page-actions">
            <button type="button" className="bill-link-action">批量操作</button>
            <button type="button" className="bill-link-action">
              <DownloadOutlined />
              <span>导出Excel</span>
            </button>
            <Button type="primary" className="bill-primary-button" onClick={() => setReportDrawerVisible(true)}>
              申请报销
            </Button>
          </div>
        </div>

        <div className="bill-filter-shell">
          <div className="bill-filter-tags">
            {filterChips.map((chip) => (
              <div key={chip} className="bill-filter-tag">{chip}</div>
            ))}
            <button type="button" className="bill-filter-link">清空</button>
            <button type="button" className="bill-filter-link">展开</button>
          </div>
          <button type="button" className="bill-filter-setting">
            <SettingOutlined />
          </button>
        </div>

        <div className="bill-content-layout">
          <section className="bill-list-panel">
            <div className="bill-list-panel-header">
              <div className="bill-list-panel-title">查询结果列表</div>
              <div className="bill-list-panel-actions">
                <div className="bill-record-count">共 {viewModel.rows.length} 条记录</div>
                <button type="button" className="bill-small-action" onClick={() => setReportDrawerVisible((open) => !open)}>
                  <BarChartOutlined />
                  <span>{reportDrawerVisible ? '收起报表' : '查看报表'}</span>
                </button>
              </div>
            </div>

            <div className="bill-table-wrap">
              <Table
                className="bill-data-table"
                columns={columns}
                dataSource={viewModel.rows}
                pagination={false}
                rowKey="key"
                size="middle"
                scroll={{ x: 1320 }}
              />
            </div>

            <div className="bill-table-footer">
              <div>共 {viewModel.rows.length} 条记录</div>
              <div className="bill-table-pagination">
                <button type="button" className="bill-page-btn bill-page-btn-disabled">{'<'}</button>
                <button type="button" className="bill-page-btn bill-page-btn-active">1</button>
                <button type="button" className="bill-page-btn">2</button>
                <button type="button" className="bill-page-btn">3</button>
                <span className="bill-page-more">...</span>
                <button type="button" className="bill-page-btn">97</button>
                <button type="button" className="bill-page-btn">{'>'}</button>
                <div className="bill-page-size">10 条/页</div>
              </div>
            </div>
          </section>

          <ReportDrawer
            visible={reportDrawerVisible}
            onClose={() => setReportDrawerVisible(false)}
            records={reimbursementRecords}
          />
        </div>
      </section>

      <button type="button" className="bill-ai-fab" onClick={() => setAiSidebarVisible(true)}>
        <MessageOutlined />
      </button>

      <AISidebar
        visible={aiSidebarVisible}
        onClose={() => setAiSidebarVisible(false)}
      />
    </main>
  );
};

export default MainContent;
