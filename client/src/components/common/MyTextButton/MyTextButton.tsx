import { Button } from 'antd';
import React from 'react';
import './MyTextButton.scss';

interface MyTextButtonProps {
  children?: any;
  onClick?: any;
  style?: any;
}

const MyTextButton: React.FC<MyTextButtonProps> = ({ style, children, onClick }) => {
  const handleClick = () => {
    onClick && onClick();
  };

  return (
    <Button
      className="my-text-button"
      onClick={handleClick}
      type="text"
      style={style}
    >
      {children}
    </Button>
  );
};

export default MyTextButton;
