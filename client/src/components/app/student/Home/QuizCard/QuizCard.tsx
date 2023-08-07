import { Tag } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizCover from '@/assets/images/quiz-cover.jpg';
import { QuizStatus } from '@/constants';
import { routePaths } from '@/constants/routePaths';
import './QuizCard.scss';

interface QuizCardProps {
  data?: any;
  status?: string;
}

const getTagColor = (status) => {
  switch (status) {
    case QuizStatus.CLOSED:
    case QuizStatus.DONE:
      return 'error';
    case QuizStatus.DOING:
      return 'warning';
    case QuizStatus.OPEN:
      return 'success';
    default:
      return '';
  }
};

const QuizCard: React.FC<QuizCardProps> = ({ data, status }) => {
  const quiz = data?.quiz || {};
  const userQuizId = data?._id || '';

  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(routePaths.QUIZ.replace(':userQuizId', userQuizId), { replace: true });
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
              {quiz?.quizType}
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
