import { RedoOutlined } from '@ant-design/icons';
import React from 'react';
import MyTooltipIcon from '@/components/common/MyTooltipIcon/MyTooltipIcon';
import './RedoButton.scss';

const RedoButton = () => (
  <div className="redo-button header-function-btn">
    <MyTooltipIcon title="Redo">
      <RedoOutlined />
    </MyTooltipIcon>
  </div>
);

export default RedoButton;
