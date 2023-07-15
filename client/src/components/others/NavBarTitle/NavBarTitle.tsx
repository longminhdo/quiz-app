import React, { useContext } from 'react';
import Icon from '@ant-design/icons';
import { LayoutContext } from '@/contexts/LayoutContext';
import './NavBarTitle.scss';
import { routePaths } from '@/constants/routePaths';
import useTypedSelector from '@/hooks/useTypedSelector';

const NavBarTitle = () => {
  const { selectedMenu } = useContext(LayoutContext);
  const { currentCollection } = useTypedSelector((state) => state.collection);
  const { currentQuiz } = useTypedSelector((state) => state.quiz);

  return (
    <div className="nav-bar-title">
      { selectedMenu.icon && (
      <Icon
        style={{
          fontSize: 24,
          transform: [routePaths.COLLECTIONS].includes(selectedMenu.key || '') ? 'translateY(1.6px)' : '',
        }}
        component={selectedMenu.icon as React.ForwardRefExoticComponent<any>}
      />
      )}
      <h1>{selectedMenu.label}</h1>

      {currentCollection && (
        <div className="detail-title">
          <span>/</span>
          <p>
            {currentCollection.title}
          </p>
        </div>
      )}

      {currentQuiz && (
      <div className="detail-title">
        <span>/</span>
        <p>
          {currentQuiz.title}
        </p>
      </div>
      )}
    </div>
  );
};

export default NavBarTitle;