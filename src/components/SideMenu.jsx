import React from 'react';
import { Menu } from 'antd';
import {
  BarChartOutlined,
  BuildOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  HomeOutlined,
  ProfileOutlined,
  SettingOutlined,
  ShoppingOutlined,
  WalletOutlined
} from '@ant-design/icons';

const SideMenu = () => {
  return (
    <aside className="app-sidebar">
      <div className="app-sidebar-brand">
        <div className="app-sidebar-brand-mark" />
        <div className="app-sidebar-brand-text">报销专版测试环</div>
      </div>

      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={['2']}
        className="app-sidebar-menu"
        items={[
          { key: '1', icon: <HomeOutlined />, label: '工作台' },
          { key: 'budget', icon: <BarChartOutlined />, label: '预算管理' },
          { key: '2', icon: <WalletOutlined />, label: '收支管理' },
          { key: '3', icon: <ShoppingOutlined />, label: '采购管理' },
          { key: '4', icon: <FileTextOutlined />, label: '合同管理' },
          { key: '5', icon: <BuildOutlined />, label: '资产管理' },
          { key: '6', icon: <ProfileOutlined />, label: '建设项目' },
          { key: '7', icon: <ProfileOutlined />, label: '重要事项' },
          { key: '8', icon: <BarChartOutlined />, label: '决策支持' },
          { key: '9', icon: <DatabaseOutlined />, label: '基础数据' },
          { key: '10', icon: <SettingOutlined />, label: '单位管理' },
        ]}
      />
    </aside>
  );
};

export default SideMenu;
