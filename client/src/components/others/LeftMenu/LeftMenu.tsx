import {
  AppstoreOutlined,
  PieChartOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LayoutContext } from '@/contexts/LayoutContext';
import { routePaths } from '@/constants/routePaths';
import './LeftMenu.scss';

const menuItems = [
  { label: 'Library', icon: AppstoreOutlined, key: routePaths.COLLECTIONS },
  { label: 'Quizzes', icon: ProfileOutlined, key: routePaths.QUIZZES },
  { label: 'Reports', icon: PieChartOutlined, key: routePaths.REPORTS },
];

const LeftMenu = () => {
  const { selectedMenu, setSelectedMenu } = useContext(LayoutContext);
  const location = useLocation();
  const navigate = useNavigate();

  const items: MenuProps['items'] = useMemo(() => menuItems.map((item) => ({
    key: item.key,
    icon: React.createElement(item.icon),
    label: item.label,
    onClick: () => navigate(item.key, { replace: true }),
  })), [navigate]);

  useEffect(() => {
    if (location.pathname) {
      setSelectedMenu(menuItems.find(item => location.pathname.includes(item.key)));
    }
  }, [location.pathname, setSelectedMenu]);

  return (
    <Menu
      className="left-menu"
      theme="light"
      mode="inline"
      items={items}
      selectedKeys={[selectedMenu.key || '']}
    />
  );
};

export default LeftMenu;