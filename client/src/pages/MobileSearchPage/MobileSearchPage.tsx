import React from 'react';
import './MobileSearchPage.scss';
import SearchQuiz from '@/components/others/SearchQuiz/SearchQuiz';

const MobileSearchPage: React.FC = () => {
  console.log('search page');
  return (
    <div className="mobile-search-page">
      <SearchQuiz />
    </div>
  );
};

export default MobileSearchPage;
