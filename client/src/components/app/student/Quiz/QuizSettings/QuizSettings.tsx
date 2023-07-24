import { SettingFilled } from '@ant-design/icons';
import React, { useState } from 'react';
import './QuizSettings.scss';
import { Button } from 'antd';

const QuizSettings: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="quiz-settings">
      <Button className="quiz-settings-btn"><SettingFilled /></Button>
    </div>
  );
};

export default QuizSettings;
