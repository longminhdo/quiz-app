import { HomeFilled } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinQuiz } from '@/actions/quizAttempt';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import MuteButton from '@/components/others/MuteButton/MuteButton';
import PlayButton from '@/components/others/PlayButton/PlayButton';
import SettingsButton from '@/components/others/SettingsButton/SettingsButton';
import { routePaths } from '@/constants/routePaths';
import { AudioContext } from '@/contexts/AudioContext';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './JoinPage.scss';

const JoinPage: React.FC = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const [run, loading] = useDispatchAsyncAction();
  const navigate = useNavigate();

  const { handleToggleMute, handleTogglePlay, muted, isPlaying } = useContext(AudioContext);

  const handleJoinClick = async () => {
    const res = await run(joinQuiz(code));

    if (res?.statusCode === 201) {
      const { data } = res;
      navigate(routePaths.QUIZ.replace(':attemptId', data.attemptId));
      return;
    }

    setError(res?.data);
  };

  const handleHomeClick = () => {
    navigate(routePaths.HOME);
  };

  return (
    <div className="join-page">
      <div className="join-page-header">
        <MyTextButton onClick={handleHomeClick} style={{ fontSize: 18, height: 34 }}><HomeFilled /></MyTextButton>
      </div>
      <div className="card-container">
        <h1>JOIN NEW QUIZ</h1>
        <div className="input-wrapper">
          <Input placeholder="Quiz Pin" value={code} onChange={(e) => setCode(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
        </div>
        <Button className="enter-btn" onClick={handleJoinClick} loading={loading}>Enter</Button>
      </div>
      <div className="join-page-footer">
        <SettingsButton />
        <PlayButton onClick={handleTogglePlay} isPlaying={isPlaying} />
        <MuteButton onClick={handleToggleMute} muted={muted} />
      </div>
    </div>
  );
};

export default JoinPage;
