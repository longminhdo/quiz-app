import { HomeFilled } from '@ant-design/icons';
import { Button, Progress } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTypedSelector from '@/hooks/useTypedSelector';
import { routePaths } from '@/constants/routePaths';
import './CompletedScreen.scss';

const CompletedScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUserQuiz } = useTypedSelector(state => state.userQuiz);
  const [statistics, setStatistics] = useState<any>({});

  useEffect(() => {
    if (!currentUserQuiz) {
      return;
    }
    const currentAttempt = currentUserQuiz?.attempts
      ? cloneDeep(currentUserQuiz.attempts[currentUserQuiz.attempts.length - 1])
      : {};

    const correctQuestions: any = [];
    const incorrectQuestions: any = [];
    const completedQuestions = currentAttempt?.completedQuestions || [];
    completedQuestions.forEach(item => {
      if (item?.correct) {
        correctQuestions.push(item);
      } else {
        incorrectQuestions.push(item);
      }
    });

    const ratio = Math.ceil(correctQuestions.length / completedQuestions.length * 100);

    setStatistics({ ratio, completedQuestions, incorrectQuestions, correctQuestions });
  }, [currentUserQuiz]);

  const handleBackHome = () => {
    navigate(routePaths.HOME);
  };

  const handleRetry = () => {
    console.log('retry');
  };

  return (
    <div className="completed-screen">
      <h2>Finished!!</h2>
      {currentUserQuiz?.quiz?.resultVisible ? (
        <div className="result">
          <Progress
            strokeColor="#d85140"
            gapDegree={75}
            type="circle"
            percent={statistics?.ratio}
            format={(ratio) => (
              <div className="text-content">
                <div className="ratio-text">
                  <span>
                    {ratio}
                  </span>
                  <sup>%</sup>
                </div>
                <p className="ratio-detail-text">
                  {statistics?.correctQuestions?.length}
                  /
                  {statistics?.completedQuestions?.length}
                </p>
              </div>
            )}
          />
        </div>
      ) : null}

      <div className="actions">
        <Button className="btn go-home-btn" onClick={handleBackHome}>
          <HomeFilled />
          <span>Back to home</span>
        </Button>
        { currentUserQuiz?.quiz?.multipleAttempts ? (
          <span className="retry-btn" onClick={handleRetry}>
            Retry
          </span>
        ) : null}
      </div>

    </div>
  );
};

export default CompletedScreen;
