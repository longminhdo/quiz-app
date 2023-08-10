import { UserOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import './ClientProfileButton.scss';

interface ClientProfileButtonProps {
  className?: string;
}

const ClientProfileButton: React.FC<ClientProfileButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate(routePaths.PROFILE);
  };

  return (
    <MyTextButton
      className={`client-home-button ${className}`}
      onClick={handleHomeClick}
      style={{ fontSize: 18, height: 34 }}
    >
      <UserOutlined />
    </MyTextButton>
  );
};

export default ClientProfileButton;
