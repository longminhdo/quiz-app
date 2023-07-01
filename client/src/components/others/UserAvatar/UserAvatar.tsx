import React from 'react';
import { Avatar, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UserAvatar.scss';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { logout } from '@/actions/authentication';

function UserAvatar() {
  const [run] = useDispatchAsyncAction();

  const handleLogout = () => {
    run(logout());
  };

  const dropdownItems: MenuProps['items'] = [
    {
      label: <a href="#" onClick={handleLogout}>Logout</a>,
      key: '0',
    },
  ];

  return (
    <div className="user-avatar">
      <Dropdown menu={{ items: dropdownItems }} trigger={['click']}>
        <a onClick={(e) => e.preventDefault()}>
          <Avatar icon={<UserOutlined />} />
        </a>
      </Dropdown>
    </div>
  );
}
export default UserAvatar;
