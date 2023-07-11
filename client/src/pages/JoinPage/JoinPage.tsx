import React, { useState } from 'react';
import './JoinPage.scss';
import { Button, Input } from 'antd';

const JoinPage: React.FC = () => {
  const [code, setCode] = useState('');
  const handleJoinClick = () => {
    console.log('navigate');
  };

  return (
    <div className="join-page">
      <div className="card-container">
        <Input placeholder="Quiz code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button className="enter-btn" onClick={handleJoinClick}>Enter</Button>
      </div>
    </div>
  );
};

export default JoinPage;
