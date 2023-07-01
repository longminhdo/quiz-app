import React, { useContext } from 'react';
import Icon from '@ant-design/icons';
import { LayoutContext } from '@/contexts/LayoutContext';
import './NavBarTitle.scss';
import { routePaths } from '@/constants/routePaths';

const NavBarTitle = () => {
  const { selectedMenu } = useContext(LayoutContext);

  return (
    <div className="nav-bar-title">
      { selectedMenu.icon && (
      <Icon
        style={{
          fontSize: 24,
          transform: [routePaths.LIBRARY].includes(selectedMenu.key || '') ? 'translateY(1.6px)' : '',
        }}
        component={selectedMenu.icon as React.ForwardRefExoticComponent<any>}
      />
      )}
      <h1>{selectedMenu.label}</h1>
    </div>
  );
};

export default NavBarTitle;