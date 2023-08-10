import { PlusCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';
import './MobileJoinButton.scss';


const MobileJoinButton: React.FC = () => {
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(routePaths.JOIN);
  };

  return (
    <div className="mobile-join-button" onClick={handleJoin}>
      <PlusCircleOutlined />
    </div>
  );
};

export default MobileJoinButton;
