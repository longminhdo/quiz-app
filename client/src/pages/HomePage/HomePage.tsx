import React from 'react';
import './HomePage.scss';

const HomePage: React.FC = () => {
  console.log('first');
  return (
    <div className="home-page">
      <h1 className="page-title">My quizzes</h1>
    </div>
  );
};

export default HomePage;
