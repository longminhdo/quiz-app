import React from 'react';
import { ExportOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown } from 'antd';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { logout } from '@/actions/authentication';
import './UserAvatar.scss';

const LogoutItem = ({ onClick }) => (
  <a href="#" onClick={onClick} className="custom-user-dropdown-item">
    <ExportOutlined />
    Logout
  </a>
);

function UserAvatar() {
  const [run] = useDispatchAsyncAction();

  const handleLogout = () => {
    run(logout());
  };

  const dropdownItems: MenuProps['items'] = [
    {
      label: <LogoutItem onClick={handleLogout} />,
      key: '0',
    },
  ];

  return (
    <div className="user-avatar">
      <Dropdown overlayClassName="custom-user-dropdown" menu={{ items: dropdownItems }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Avatar icon={<UserOutlined />} />
        </a>
      </Dropdown>
    </div>
  );
}
export default UserAvatar;
