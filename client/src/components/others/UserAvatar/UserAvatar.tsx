import React from 'react';
import { ExportOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Avatar, Dropdown } from 'antd';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { logout } from '@/actions/authentication';
import './UserAvatar.scss';
import useTypedSelector from '@/hooks/useTypedSelector';

const LogoutItem = ({ onClick }) => (
  <a href="#" onClick={onClick} className="custom-user-dropdown-item">
    <ExportOutlined />
    Logout
  </a>
);

const UserAvatar = () => {
  const [run] = useDispatchAsyncAction();
  const { avatar } = useTypedSelector(state => state.user);

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
          { avatar ? <Avatar src={avatar} /> : <Avatar icon={<UserOutlined />} />}
        </a>
      </Dropdown>
    </div>
  );
};

export default UserAvatar;
