import React, { useEffect, useState } from 'react';
import QuizLogo from '@/assets/images/quiz-logo.png';
import './LoadingScreen.scss';


const LoadingScreen: React.FC = () => {
  const [loadingText, setLoadingText] = useState('Loading');
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
    setLoadingText(`Loading${'.'.repeat(dotsCount)}`);
  }, [dotsCount]);

  return (
    <div className="loading-screen">
      <div className="content-wrapper">
        <img className="logo-img" src={QuizLogo} alt="" />
        <p>{loadingText}</p>
        {!loadingText.startsWith('Loading') && (
        <div>
          <p>This is the main content.</p>
        </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
