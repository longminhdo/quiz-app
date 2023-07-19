import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { joinQuiz } from '@/actions/quizAttempt';
import './JoinPage.scss';
import { routePaths } from '@/constants/routePaths';

// TODO: Join page
const JoinPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [run, loading] = useDispatchAsyncAction();
  const navigate = useNavigate();

  const handleJoinClick = async () => {
    const res = await run(joinQuiz(code));

    if (res?.statusCode === 201) {
      const { data } = res;
      navigate(routePaths.QUIZ.replace(':attemptId', data.attemptId));
    }
  };

  return (
    <div className="join-page">
      <div className="card-container">
        <Input placeholder="Quiz code" value={code} onChange={(e) => setCode(e.target.value)} />
        <Button className="enter-btn" onClick={handleJoinClick} loading={loading}>Enter</Button>
      </div>
    </div>
  );
};

export default JoinPage;
