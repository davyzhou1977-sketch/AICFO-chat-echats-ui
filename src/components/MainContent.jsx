import React, { useState } from 'react';
import { Button, Input, Select, Table, Space, Tag, Pagination, Tooltip } from 'antd';
import { BarChartOutlined, DownloadOutlined, MessageOutlined } from '@ant-design/icons';
import AISidebar from './AISidebar';
import ReportDrawer from './ReportDrawer';

const { Option } = Select;

const MainContent = () => {
  const [aiSidebarVisible, setAiSidebarVisible] = useState(false);
  const [reportDrawerVisible, setReportDrawerVisible] = useState(true);
  
  const columns = [
    {
      title: '单据编号',
      dataIndex: 'code',
      key: 'code',
      width: 150,
    },
    {
      title: '审批状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = '';
        switch (status) {
          case '审批中':
            color = 'blue';
            break;
          case '待提交':
            color = 'orange';
            break;
          case '已通过':
            color = 'green';
            break;
          case '被驳回':
            color = 'red';
            break;
          default:
            color = 'default';
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '报销事由',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
    },
    {
      title: '申请部门',
      dataIndex: 'department',
      key: 'department',
      width: 100,
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
      width: 120,
    },
    {
      title: '下一审批人',
      dataIndex: 'nextApprover',
      key: 'nextApprover',
      width: 120,
    },
    {
      title: '报销金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount) => <span style={{ textAlign: 'right' }}>¥{amount.toFixed(2)}</span>,
    },
  ];

  const data = [
    {
      key: '1',
      code: 'RI-20260309-0006',
      status: '审批中',
      reason: '成都新锦城吃饭',
      department: '工会',
      applicant: '刘老师.1000',
      date: '2026-03-09',
      nextApprover: '财务杨',
      amount: 19099,
    },
    {
      key: '2',
      code: 'RI-20260309-0005',
      status: '审批中',
      reason: '1天差旅费',
      department: '其他',
      applicant: '张老师.10093',
      date: '2026-03-09',
      nextApprover: '张老师.10093',
      amount: 1,
    },
    {
      key: '3',
      code: 'RI-20260309-0004',
      status: '审批中',
      reason: '1天差旅费',
      department: '人事部',
      applicant: '管老师.1',
      date: '2026-03-09',
      nextApprover: '管老师.1',
      amount: 1,
    },
    {
      key: '4',
      code: 'RI-20260309-0003',
      status: '审批中',
      reason: '1111',
      department: '其他',
      applicant: '张老师.10093',
      date: '2026-03-09',
      nextApprover: '张老师.10093',
      amount: 1,
    },
    {
      key: '5',
      code: 'RI-20260309-0002',
      status: '审批中',
      reason: '11',
      department: '其他',
      applicant: '张老师.10093',
      date: '2026-03-09',
      nextApprover: '张老师.10093',
      amount: 1,
    },
    {
      key: '6',
      code: 'RI-20260309-0001',
      status: '审批中',
      reason: '23',
      department: '其他',
      applicant: '张老师.10093',
      date: '2026-03-09',
      nextApprover: '张老师.10093',
      amount: 1,
    },
    {
      key: '7',
      code: 'RI-20260306-0002',
      status: '审批中',
      reason: '再试试的问题',
      department: '人事部',
      applicant: '管老师.1',
      date: '2026-03-06',
      nextApprover: '管老师.1',
      amount: 2,
    },
    {
      key: '8',
      code: 'RI-20260306-0001',
      status: '审批中',
      reason: '附件有问题的',
      department: '人事部',
      applicant: '管老师.1',
      date: '2026-03-06',
      nextApprover: '管老师.1',
      amount: 1,
    },
    {
      key: '9',
      code: 'RI-20260305-0006',
      status: '待提交',
      reason: '合并战略-森林',
      department: '人事部',
      applicant: '管老师.1',
      date: '2026-03-05',
      nextApprover: '',
      amount: 19,
    },
    {
      key: '10',
      code: 'RI-20260305-0004',
      status: '审批中',
      reason: '1',
      department: '人事部',
      applicant: '管老师.1',
      date: '2026-03-05',
      nextApprover: '管老师.1',
      amount: 1,
    },
  ];

  return (
    <div style={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f5f5f5' }}>
      {/* 顶部菜单栏 */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>2026年</span>
          <span style={{ color: '#666', fontSize: '14px' }}>管老师_1</span>
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#1890ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
            管
          </div>
        </div>
      </div>

      {/* Title信息 */}
      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>报销单</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Button>批量操作</Button>
          <Button icon={<DownloadOutlined />}>导出Excel</Button>
          <Button type="primary" icon={<BarChartOutlined />} onClick={() => setReportDrawerVisible(true)}>
            AI报表查询
          </Button>
        </div>
      </div>

      {/* 查询条件 */}
      <div style={{ padding: '12px 16px', margin: '0 16px', borderRadius: '4px', display: 'flex', gap: '12px', alignItems: 'center', backgroundColor: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>审批状态：</span>
          <Select defaultValue="all" style={{ width: 180 }} size="small">
            <Option value="all">全部</Option>
            <Option value="pending">待提交</Option>
            <Option value="approving">审批中</Option>
            <Option value="rejected">被驳回</Option>
            <Option value="approved">已通过</Option>
          </Select>
        </div>
        <Button size="small">清空</Button>
        <Button size="small">展开</Button>
      </div>

      {/* 主体区域 */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '16px', display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1, minWidth: 0, overflow: 'auto' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(15, 23, 42, 0.04)' }}>
            <Table 
              columns={columns} 
              dataSource={data} 
              pagination={false}
              bordered
              rowKey="key"
              size="small"
              style={{ 
                border: '1px solid #e8e8e8',
                borderRadius: '18px',
                overflow: 'hidden'
              }}
            />
            <div style={{ marginTop: '16px', padding: '0 16px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>共 198 条记录</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Pagination 
                  current={2} 
                  total={198} 
                  pageSize={10} 
                  showSizeChanger={false} 
                  size="small"
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>10条/页</span>
                  <span>跳至</span>
                  <Input style={{ width: 60 }} defaultValue="2" size="small" />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ReportDrawer
          visible={reportDrawerVisible}
          onClose={() => setReportDrawerVisible(false)}
        />
      </div>

      {/* 悬浮按钮 */}
      <div style={{ position: 'fixed', right: 24, bottom: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Tooltip title="智能AI问答">
          <Button 
            shape="circle" 
            icon={<MessageOutlined />} 
            style={{ 
              width: 48, 
              height: 48, 
              fontSize: 20, 
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              backgroundColor: '#1890ff',
              borderColor: '#1890ff'
            }} 
            onClick={() => setAiSidebarVisible(true)} 
          />
        </Tooltip>
      </div>

      {/* 智能AI问答侧边栏 */}
      <AISidebar 
        visible={aiSidebarVisible} 
        onClose={() => setAiSidebarVisible(false)} 
      />
    </div>
  );
};

export default MainContent;
