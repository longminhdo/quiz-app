import { EyeOutlined } from '@ant-design/icons';
import React from 'react';
import MyTooltipIcon from '@/components/common/MyTooltipIcon/MyTooltipIcon';
import './ViewformButton.scss';

const ViewformButton = () => (
  <div className="header-function-btn viewform-button">
    <MyTooltipIcon title="Preview">
      <EyeOutlined />
    </MyTooltipIcon>
  </div>
);

export default ViewformButton;
