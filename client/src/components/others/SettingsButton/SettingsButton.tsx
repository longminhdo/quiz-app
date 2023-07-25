import { SettingFilled } from '@ant-design/icons';
import React from 'react';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import './SettingsButton.scss';

interface SettingsButtonProps {
  onClick?: any;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => (
  <MyTextButton onClick={onClick} className="settings-button">
    <SettingFilled />
  </MyTextButton>
);

export default SettingsButton;
