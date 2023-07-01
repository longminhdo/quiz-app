import { UndoOutlined } from '@ant-design/icons';
import React from 'react';
import MyTooltipIcon from '@/components/common/MyTooltipIcon/MyTooltipIcon';
import './UndoButton.scss';

const UndoButton = () => (
  <div className="undo-button header-function-btn">
    <MyTooltipIcon title="Undo">
      <UndoOutlined />
    </MyTooltipIcon>
  </div>
);

export default UndoButton;
