import React, { useCallback } from 'react';
import { getSSOToken } from '@/actions/authentication';
import HustLogo from '@/assets/images/hust-logo.png';
import QuizLogo from '@/assets/images/quiz-logo.png';
import Background from '@/assets/images/login-background.jpg';
import MyTextButton from '@/components/common/MyTextButton/MyTextButton';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './LoginPage.scss';

const LoginPage: React.FC = () => {
  const [run] = useDispatchAsyncAction();

  const handleSSOLogin = useCallback(async () => {
    const { data } = await run(getSSOToken());
    window.location.replace(data.url);
  }, [run]);

  return (
    <div className="login-page">
      <div className="login-container">
        <p>Sign in to continue</p>
        <img src={QuizLogo} alt="" />
        <MyTextButton
          onClick={handleSSOLogin}
          className="login-btn"
        >
          <img src={HustLogo} alt="" />
          Sign in with HUST account
        </MyTextButton>
      </div>

      <img className="background-img" src={Background} alt="" />
      <div className="dim-transparent" />
    </div>
  );
};

export default LoginPage;
