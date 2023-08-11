import { SearchOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import './ClientSearchButton.scss';

interface ClientSearchButtonProps {
  className?: string;
}

const ClientSearchButton: React.FC<ClientSearchButtonProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(routePaths.MOBILE_SEARCH);
  };

  return (
    <MyTextButton
      className={`client-search-button ${className}`}
      onClick={handleClick}
      style={{ fontSize: 18, height: 34 }}
    >
      <SearchOutlined />
    </MyTextButton>
  );
};

export default ClientSearchButton;
