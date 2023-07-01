import { Collapse } from 'antd';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './MyCollapse.scss';

const { Panel } = Collapse;

const MyCollapse = ({ items, className, ...rest }) => (
  <Collapse className={`my-collapse ${className}`} {...rest}>
    {items?.map(({ header, body }) => (
      <Panel key={uuidv4()} header={header}>
        {body}
      </Panel>
    ))}
  </Collapse>
);

export default MyCollapse;
