import React, { useState } from 'react';
import MySwitch from '@/components/common/MySwitch/MySwitch';
import './AcceptingResponses.scss';

const AcceptingResponses = () => {
  const [active, setActive] = useState(true);
  const handleChange = (value: boolean) => {
    setActive(value);
  };

  return (
    <div className="accepting-responses">
      {active ? (
        <div className="active-accepting-responses">
          Accepting responses
          {' '}
          <MySwitch
            onClick={() => handleChange(false)}
            checked={active}
            disabled
          />
        </div>
      ) : (
        <div className="inactive-accepting-responses">test</div>
      )}
    </div>
  );
};

export default AcceptingResponses;
