import React from 'react';
import { Menu } from 'antd';
import { 
  HomeOutlined, 
  WalletOutlined, 
  ShoppingOutlined, 
  FileTextOutlined, 
  BuildOutlined, 
  BarChartOutlined, 
  DatabaseOutlined, 
  SettingOutlined
} from '@ant-design/icons';

const SideMenu = () => {
  return (
    <div style={{ width: 180, height: '100vh', background: '#001529', color: '#fff', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 0 20px 20px', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #1f2937' }}>
        报销管理系统
      </div>
      <Menu
        mode="inline"
        style={{ 
          flex: 1, 
          background: '#001529', 
          borderRight: 0,
          padding: '16px 0',
          color: '#fff'
        }}
        defaultSelectedKeys={['2']}
        items={[
          {
            key: '1',
            icon: <HomeOutlined />,
            label: '工作台',
          },
          {
            key: '2',
            icon: <WalletOutlined />,
            label: '收支管理',
          },
          {
            key: '3',
            icon: <ShoppingOutlined />,
            label: '采购管理',
          },
          {
            key: '4',
            icon: <FileTextOutlined />,
            label: '合同管理',
          },
          {
            key: '5',
            icon: <BuildOutlined />,
            label: '资产管理',
          },
          {
            key: '6',
            icon: <BarChartOutlined />,
            label: '决策支持',
          },
          {
            key: '7',
            icon: <DatabaseOutlined />,
            label: '基础数据',
          },
          {
            key: '8',
            icon: <SettingOutlined />,
            label: '单位管理',
          },
        ]}
        itemStyle={{
          margin: '4px 12px',
          borderRadius: '4px'
        }}
        selectedKeys={['2']}
        theme="dark"
      />
    </div>
  );
};

export default SideMenu;