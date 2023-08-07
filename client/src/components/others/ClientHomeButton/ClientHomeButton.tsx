import { HomeFilled } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import './ClientHomeButton.scss';


const ClientHomeButton: React.FC = () => {
  const navigate = useNavigate();
  const handleHomeClick = () => {
    navigate(routePaths.HOME);
  };

  return (
    <MyTextButton
      className="client-home-button"
      onClick={handleHomeClick}
      style={{ fontSize: 18, height: 34 }}
    >
      <HomeFilled />
    </MyTextButton>
  );
};

export default ClientHomeButton;
