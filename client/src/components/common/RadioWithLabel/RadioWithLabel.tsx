import React from 'react';
import { Radio } from 'antd';
import './RadioWithLabel.scss';

interface RadioWithLabelProps {
  value: string;
  label?: string;
  checked: boolean;
  onClick?: (value?: any) => any;
  img?: string;
}

const RadioWithLabel: React.FC<RadioWithLabelProps> = ({
  value,
  label,
  checked,
  onClick,
  img,
}) => (
  <div className="radio-with-label">
    <Radio
      value={value}
      checked={checked}
      onClick={onClick}
    >
      <div className="radio-with-label-contents">
        {img ? (
          <img src={img} alt="" className="radio-with-label-contents-img" />
        ) : null}
        {label ? <span>{label}</span> : null}
      </div>
    </Radio>
  </div>
);

export default RadioWithLabel;
