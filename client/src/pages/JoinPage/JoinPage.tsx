import { Button, Input } from 'antd';
import React, { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinQuiz } from '@/actions/userQuiz';
import ClientHomeButton from '@/components/others/ClientHomeButton/ClientHomeButton';
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

  const codeRef = useRef<any>();

  const [run, loading] = useDispatchAsyncAction();
  const navigate = useNavigate();

  const { handleToggleMute, handleTogglePlay, muted, isPlaying } = useContext(AudioContext);

  const join = async () => {
    const res = await run(joinQuiz(code), { disableErrorToast: true });

    if (res?.statusCode === 200) {
      const { data } = res;
      navigate(routePaths.QUIZ.replace(':userQuizId', data.userQuizId));
      return;
    }

    setError(res?.data);
    codeRef.current.focus();
  };

  const handleJoinClick = () => {
    join();
  };

  const handleKeyup = (event) => {
    if (event.key === 'Enter' || event.keyCode === 13) {
      join();
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setError('');
  };

  return (
    <div className="join-page">
      <div className="join-page-header">
        <ClientHomeButton />
      </div>
      <div className="card-container">
        <h1>JOIN NEW QUIZ</h1>
        <div className="input-wrapper">
          <Input ref={codeRef} placeholder="Quiz Pin" value={code} onKeyUp={handleKeyup} onChange={handleCodeChange} />
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
