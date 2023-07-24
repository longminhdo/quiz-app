import React from 'react';
import './HomePage.scss';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  console.log('first');
  return <div className="home-page">HomePage</div>;
};

export default HomePage;
