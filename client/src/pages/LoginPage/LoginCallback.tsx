import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ssoLogin } from '@/actions/authentication';
import useDispatchAsyncAction from '@/hooks/useDispatchAsyncAction';
import './LoginPage.scss';

const LoginCallback = () => {
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

  return null;
};

export default LoginCallback;
