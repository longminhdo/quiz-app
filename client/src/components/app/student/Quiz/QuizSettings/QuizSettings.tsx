import { SettingFilled } from '@ant-design/icons';
import React from 'react';
import './QuizSettings.scss';
import { Button } from 'antd';

const QuizSettings: React.FC = () => {
  console.log('settings');
  return (
    <div className="quiz-settings">
      <Button className="quiz-settings-btn"><SettingFilled /></Button>
    </div>
  );
};

export default QuizSettings;
