import { Tooltip } from 'antd';
import React from 'react';
import './MyTooltipIcon.scss';

interface MyTooltipIconProps {
  children: any;
  title: any;
  placement?:
    | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom';
  className?: string;
  onClick?: any;
}

const MyTooltipIcon: React.FC<MyTooltipIconProps> = ({
  children,
  title,
  placement = 'bottom',
  className,
  onClick,
}) => {
  const handleClick = (e) => {
    onClick && onClick(e);
  };

  return (
    <div className={`icon my-tooltip-icon ${className ?? ''}`} onClick={handleClick}>
      <Tooltip
        destroyTooltipOnHide
        placement={placement}
        title={title}
        overlayClassName="custom-tooltip-overlay"
      >
        {children}
      </Tooltip>
    </div>
  );
};

export default MyTooltipIcon;
