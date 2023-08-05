import {
  ExportOutlined,
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, MenuProps } from 'antd';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout } from '@/actions/authentication';
import { routePaths } from '@/constants/routePaths';
import { ClientLayoutContext } from '@/contexts/ClientLayoutContext';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import useTypedSelector from '@/hooks/useTypedSelector';
import './ClientLeftMenu.scss';

const menuItems = [
  { label: 'Home', icon: HomeOutlined, key: routePaths.HOME },
  { label: 'Profile', icon: UserOutlined, key: routePaths.PROFILE },
  { label: 'Settings', icon: SettingOutlined, key: routePaths.SETTINGS },
  { label: 'Logout', icon: ExportOutlined, key: 'logout' },
];

const ClientLeftMenu: React.FC = () => {
  const { selectedMenu, setSelectedMenu } = useContext(ClientLayoutContext);
  const location = useLocation();
  const navigate = useNavigate();

  const { fullName, avatar } = useTypedSelector(state => state.user);
  const [run] = useDispatchAsyncAction();

  const handleLogout = useCallback(() => {
    run(logout());
  }, [run]);

  const items: MenuProps['items'] = useMemo(() => menuItems.map((item) => ({
    key: item.key,
    icon: React.createElement(item.icon),
    label: item.label,
    onClick: () => {
      if (item.key === 'logout') {
        handleLogout();
      } else {
        navigate(item.key, { replace: true });
      }
    },
  })), [handleLogout, navigate]);

  useEffect(() => {
    if (location.pathname) {
      setSelectedMenu(menuItems.find(item => location.pathname.includes(item.key)));
    }
  }, [location.pathname, setSelectedMenu]);

  return (
    <div className="client-left-menu-wrapper">
      <div className="user-info">
        {avatar ? (
          <Avatar
            className="user-avatar"
            src={avatar}
          />
        ) : (
          <Avatar
            className="user-avatar"
            icon={<UserOutlined />}
          />
        )}
        <p className="full-name">{fullName}</p>
      </div>
      <Menu
        className="client-left-menu"
        theme="light"
        mode="inline"
        items={items}
        selectedKeys={[selectedMenu.key || '']}
      />
    </div>
  );
};

export default ClientLeftMenu;
