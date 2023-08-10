import { SettingFilled } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import './ClientSettingsButton.scss';

interface ClientSettingsButtonProps {
  className?: string;
}

const ClientSettingsButton: React.FC<ClientSettingsButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(routePaths.SETTINGS);
  };

  return (
    <MyTextButton
      className={`client-settings-button ${className}`}
      onClick={handleClick}
      style={{ fontSize: 18, height: 34 }}
    >
      <SettingFilled />
    </MyTextButton>
  );
};

export default ClientSettingsButton;
