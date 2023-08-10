import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ssoLogin } from '@/actions/authentication';
import LoadingScreen from '@/components/others/LoadingScreen/LoadingScreen';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './LoginPage.scss';

const LoginCallback: React.FC = () => {
  const [run] = useDispatchAsyncAction();
  const [searchParams] = useSearchParams();
  const ssoToken = searchParams.get('token');

  useEffect(() => {
    if (ssoToken) {
      (async () => {
        await run(ssoLogin(ssoToken));
      })();
    }
  }, [run, ssoToken]);

  return <div className="login-callback"><LoadingScreen /></div>;
};

export default LoginCallback;
