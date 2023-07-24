import { Button, Input } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinQuiz } from '@/actions/quizAttempt';
import { routePaths } from '@/constants/routePaths';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './JoinPage.scss';

// TODO: Join page
const JoinPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const [run, loading] = useDispatchAsyncAction();
  const navigate = useNavigate();

  const handleJoinClick = async () => {
    const res = await run(joinQuiz(code));

    if (res?.statusCode === 201) {
      const { data } = res;
      navigate(routePaths.QUIZ.replace(':attemptId', data.attemptId));
      return;
    }

    setError(res?.data);
  };

  return (
    <div className="join-page">
      <div className="card-container">
        <div className="input-wrapper">
          <Input placeholder="Quiz code" value={code} onChange={(e) => setCode(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
        </div>
        <Button className="enter-btn" onClick={handleJoinClick} loading={loading}>Enter</Button>
      </div>
    </div>
  );
};

export default JoinPage;
