import React, { useEffect, useState } from 'react';
import QuizLogo from '@/assets/images/quiz-logo.png';
import './LoadingScreen.scss';


const LoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState('');
  const [dotsCount, setDotsCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotsCount((prevCount) => (prevCount + 1) % 4);
    }, 500); // Change the value to control the speed of the dots animation

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    setLoadingText(`${'.'.repeat(dotsCount)}`);
  }, [dotsCount]);

  return (
    <div className="loading-screen">
      <div className="content-wrapper">
        <img className="logo-img" src={QuizLogo} alt="" />
        <div className="loading-text">
          <div>
            <span className="red-text">HUSTLE</span>
            <span className="gray-text">ly</span>
          </div>
          <span className="gray-text">
            connecting to
            {' '}
          </span>
          <div className="quiz-text-combination">
            <span className="yellow-text">QUIZ</span>
            <span className="gray-text">
              {loadingText}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
