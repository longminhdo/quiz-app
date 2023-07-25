import { HomeFilled } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import { routePaths } from '@/constants/routePaths';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import { joinQuiz } from '@/actions/quizAttempt';
import './JoinPage.scss';

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

  const handleHomeClick = () => {
    navigate(routePaths.HOME);
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<any>(null);


  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handleTogglePlay = () => {
    setIsPlaying((prevState) => !prevState);
  };

  const handleToggleMute = () => {
    setIsMuted((prevState) => !prevState);
  };

  return (
    <div className="join-page">
      <audio ref={audioRef} loop muted={isMuted} preload="auto">
        <source
          src="https://res.cloudinary.com/thecodingpanda/video/upload/v1690269177/y2mate.com_-_Quiz_Background_Music_4_No_Copyright_dmbz3j.mp3"
          type="audio/mpeg"
        />
        <track kind="captions" label="English Captions" srcLang="en" default />
        Your browser does not support the audio element.
      </audio>
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
        <MyTextButton onClick={handleTogglePlay} />
        <MyTextButton onClick={handleToggleMute}>mute</MyTextButton>
      </div>
    </div>
  );
};

export default JoinPage;
