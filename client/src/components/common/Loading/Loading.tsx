import { Spin } from 'antd';
import React from 'react';
import './Loading.scss';

const Loading = ({ className }: {className?: string}) => (
  <div className={`loading ${className}`}>
    <Spin tip="Loading" size="large" />
  </div>
);

export default Loading;
