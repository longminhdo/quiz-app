import moment from 'moment';
import React from 'react';
import './Deadline.scss';

interface DeadlineProps {
  endTime?: number | string;
}

const Deadline: React.FC<DeadlineProps> = ({ endTime }) => {
  const deadlineDate = moment(Number(endTime) * 1000).format('MMMM Do, YYYY [at] h:mm A');

  return (
    <div className="deadline">
      <span>
        Close at
      </span>
      {deadlineDate}
    </div>
  );
};

export default Deadline;
