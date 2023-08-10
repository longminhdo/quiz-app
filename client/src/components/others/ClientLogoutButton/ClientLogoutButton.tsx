import { ExportOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { logout } from '@/actions/authentication';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './ClientLogoutButton.scss';

interface ClientLogoutButtonProps {
  className?: string;
}

const ClientLogoutButton: React.FC<ClientLogoutButtonProps> = ({ className = '' }) => {
  const [run] = useDispatchAsyncAction();

  const handleLogout = useCallback(() => {
    run(logout());
  }, [run]);

  return (
    <MyTextButton
      className={`client-logout-button ${className}`}
      onClick={handleLogout}
      style={{ fontSize: 18, height: 34 }}
    >
      <ExportOutlined />
    </MyTextButton>
  );
};

export default ClientLogoutButton;
