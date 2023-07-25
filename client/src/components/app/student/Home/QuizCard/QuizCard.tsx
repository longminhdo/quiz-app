import { Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { routePaths } from '@/constants/routePaths';
import QuizCover from '@/assets/images/quiz-cover.jpg';
import './QuizCard.scss';
import { DATE_FORMAT, QuizStatus } from '@/constants';
import { convertTime } from '@/utilities/helpers';

interface QuizCardProps {
  data?: any;
  status?: string;
}

const getTagColor = (status) => {
  switch (status) {
    case QuizStatus.DOING:
      return 'error';
    case QuizStatus.DONE:
      return 'success';
    case QuizStatus.OPEN:
      return 'warning';
    default:
      return '';
  }
};

const QuizCard: React.FC<QuizCardProps> = ({ data, status }) => {
  const quiz = data?.quiz || {};
  const attemptId = data?._id || '';

  console.log();

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(routePaths.QUIZ.replace(':attemptId', attemptId), { replace: true });
  };

  return (
    <div className="quiz-card" onClick={handleCardClick}>
      <div className="image-section">
        <img src={QuizCover} alt="" />
      </div>
      <div className="info-section">
        <div className="info-main">
          <div className="item-status">
            <Tag>
              Deadline
              {' '}
              {convertTime(data?.endedAt, DATE_FORMAT.DATE)}
            </Tag>
            <Tag style={{ fontWeight: 600, textTransform: 'uppercase' }} color={getTagColor(status)}>{status}</Tag>
          </div>
          <div className="item-title">
            {quiz?.title}
          </div>
        </div>

        <div className="item-extra">
          <span>
            {quiz?.questions?.length}
            {' '}
            Questions
          </span>
          <div className="dot" />
          <span>142222</span>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
