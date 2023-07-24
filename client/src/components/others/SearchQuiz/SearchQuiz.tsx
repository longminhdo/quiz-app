import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import React from 'react';
import './SearchQuiz.scss';

const SearchQuiz: React.FC = () => {
  console.log('first');
  return (
    <div className="search-quiz">
      <Input
        size="large"
        placeholder="Search quiz..."
        allowClear
        prefix={<SearchOutlined />}
      />
    </div>
  );
};

export default SearchQuiz;
