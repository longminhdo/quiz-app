import { Checkbox } from 'antd';
import React, { FunctionComponent } from 'react';
import './CheckboxWithLabel.scss';

interface CheckboxWithLabelProps {
  value: string;
  label?: string;
  checked: boolean;
  onClick?: (value?: any) => any;
  img?: string;
}

const CheckboxWithLabel: FunctionComponent<CheckboxWithLabelProps> = ({
  value,
  label,
  checked,
  onClick,
  img,
}) => (
  <div className="checkbox-with-label">
    <Checkbox value={value} checked={checked} onClick={onClick}>
      <div className="checkbox-with-label-contents">
        {img ? (
          <img
            src={img}
            alt=""
            className="checkbox-with-label-contents-img"
          />
        ) : null}
        {label ? (
          <span className={img ? 'marginBottom' : ''}>{label}</span>
        ) : null}
      </div>
    </Checkbox>
  </div>
);

export default CheckboxWithLabel;
