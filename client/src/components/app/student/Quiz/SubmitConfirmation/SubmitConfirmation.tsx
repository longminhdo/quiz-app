import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import React from 'react';
import './SubmitConfirmation.scss';

interface SubmitConfirmationProps {
  onSubmit?: any;
}

const SubmitConfirmation:React.FC<SubmitConfirmationProps> = ({ onSubmit }) => {
  const handleSubmit = () => {
    onSubmit && onSubmit();
  };

  return (
    <div className="submit-confirmation">
      <h2>Once you submit, you will no longer be able to change your answers for this attempt!</h2>
      <Button className="submit-btn" onClick={handleSubmit}>
        <span>Submit</span>
        <ArrowRightOutlined />
      </Button>
    </div>
  );
};

export default SubmitConfirmation;
