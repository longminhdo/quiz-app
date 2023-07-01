import { Switch, SwitchProps } from 'antd';
import React from 'react';
import './MySwitch.scss';

interface MySwitchProps extends SwitchProps {
  value?: boolean;
}

const MySwitch: React.FC<MySwitchProps> = ({ value, ...rest }) => (
  <div className="my-switch">
    <Switch checked={value} {...rest} />
  </div>
);

export default MySwitch;
